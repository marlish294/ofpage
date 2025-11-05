const jwt = require('jsonwebtoken');
const prisma = require('./database');

let io = null;

const initializeSocketIO = (socketIO) => {
    io = socketIO;

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, email: true, role: true, isActive: true }
            });

            if (!user || !user.isActive) {
                return next(new Error('User not found or inactive'));
            }

            socket.userId = user.id;
            socket.userRole = user.role;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User ${socket.userId} connected`);

        // Join user to their personal room
        socket.join(`user_${socket.userId}`);

        // Join manager to their model's room if they have one
        if (socket.userRole === 'MANAGER') {
            socket.join(`manager_${socket.userId}`);
        }

        // Handle joining chat room
        socket.on('join_chat', async (data) => {
            try {
                const { modelId, userId } = data;

                if (socket.userRole === 'MANAGER') {
                    // Manager joins specific user's chat room
                    const manager = await prisma.manager.findUnique({
                        where: { userId: socket.userId },
                        include: { model: true }
                    });

                    if (!manager || !manager.model || manager.model.id !== modelId) {
                        socket.emit('error', { message: 'No access to this model' });
                        return;
                    }

                    // Find or create chat for this specific user + model
                    let chat;
                    if (userId) {
                        chat = await prisma.chat.findFirst({
                            where: {
                                userId: userId,
                                modelId: modelId
                            }
                        });

                        if (!chat) {
                            // Create chat if it doesn't exist
                            chat = await prisma.chat.create({
                                data: {
                                    userId: userId,
                                    modelId: modelId
                                }
                            });
                        }

                        socket.join(`chat_${chat.id}`);
                        socket.emit('joined_chat', { modelId, chatId: chat.id });
                    } else {
                        // If no userId provided, manager joins model room for all chats
                        socket.join(`model_${modelId}`);
                        socket.emit('joined_chat', { modelId });
                    }
                } else if (socket.userRole === 'USER') {
                    // Check if user is blocked by the model's manager
                    const model = await prisma.model.findUnique({
                        where: { id: modelId },
                        include: {
                            manager: {
                                include: {
                                    user: {
                                        select: { id: true }
                                    }
                                }
                            }
                        }
                    });

                    if (model && model.manager) {
                        const managerUserId = model.manager.user.id;
                        const blockRecord = await prisma.blockedUser.findUnique({
                            where: {
                                blockedById_blockedUserId: {
                                    blockedById: managerUserId,
                                    blockedUserId: socket.userId
                                }
                            }
                        });

                        if (blockRecord) {
                            socket.emit('error', { message: 'You are blocked from accessing this model' });
                            return;
                        }
                    }

                    // User joins their own chat room with model
                    const subscription = await prisma.subscription.findFirst({
                        where: {
                            userId: socket.userId,
                            modelId: modelId,
                            isActive: true
                        }
                    });

                    if (!subscription) {
                        socket.emit('error', { message: 'No access to this model' });
                        return;
                    }

                    // Find or create chat
                    let chat = await prisma.chat.findFirst({
                        where: {
                            userId: socket.userId,
                            modelId: modelId
                        }
                    });

                    if (!chat) {
                        chat = await prisma.chat.create({
                            data: {
                                userId: socket.userId,
                                modelId: modelId
                            }
                        });
                    }

                    socket.join(`chat_${chat.id}`);
                    socket.emit('joined_chat', { modelId, chatId: chat.id });
                } else if (socket.userRole === 'ADMIN') {
                    // Admin can join any chat
                    socket.join(`model_${modelId}`);
                    socket.emit('joined_chat', { modelId });
                }
            } catch (error) {
                console.error('Join chat error:', error);
                socket.emit('error', { message: 'Failed to join chat' });
            }
        });

        // Handle leaving chat room
        socket.on('leave_chat', (data) => {
            const { modelId } = data;
            socket.leave(`chat_${modelId}`);
            socket.emit('left_chat', { modelId });
        });

        // Handle sending messages
        socket.on('send_message', async (data) => {
            try {
                const { modelId, content, userId } = data;

                if (!content || content.trim().length === 0) {
                    socket.emit('error', { message: 'Message cannot be empty' });
                    return;
                }

                // Verify access and get chat
                let chat;
                if (socket.userRole === 'MANAGER') {
                    // Manager sending message - need to find which user they're chatting with
                    const manager = await prisma.manager.findUnique({
                        where: { userId: socket.userId },
                        include: { model: true }
                    });

                    if (!manager || !manager.model || manager.model.id !== modelId) {
                        socket.emit('error', { message: 'No access to this model' });
                        return;
                    }

                    // For manager, we need userId from data to find the correct chat
                    if (!data.userId) {
                        socket.emit('error', { message: 'userId required for manager messages' });
                        return;
                    }

                    chat = await prisma.chat.findFirst({
                        where: {
                            userId: data.userId,
                            modelId: modelId
                        }
                    });

                    if (!chat) {
                        socket.emit('error', { message: 'Chat not found' });
                        return;
                    }
                } else {
                    // Regular user sending message - check if blocked
                    if (socket.userRole === 'USER') {
                        const model = await prisma.model.findUnique({
                            where: { id: modelId },
                            include: {
                                manager: {
                                    include: {
                                        user: {
                                            select: { id: true }
                                        }
                                    }
                                }
                            }
                        });

                        if (model && model.manager) {
                            const managerUserId = model.manager.user.id;
                            const blockRecord = await prisma.blockedUser.findUnique({
                                where: {
                                    blockedById_blockedUserId: {
                                        blockedById: managerUserId,
                                        blockedUserId: socket.userId
                                    }
                                }
                            });

                            if (blockRecord) {
                                socket.emit('error', { message: 'You are blocked from messaging this model' });
                                return;
                            }
                        }
                    }

                    const subscription = await prisma.subscription.findFirst({
                        where: {
                            userId: socket.userId,
                            modelId: modelId,
                            isActive: true
                        }
                    });

                    if (!subscription && socket.userRole !== 'ADMIN') {
                        socket.emit('error', { message: 'No access to this model' });
                        return;
                    }

                    chat = await prisma.chat.findFirst({
                        where: {
                            userId: socket.userId,
                            modelId: modelId
                        }
                    });
                }

                if (!chat) {
                    socket.emit('error', { message: 'Chat not found' });
                    return;
                }

                // Create message with chatId
                const message = await prisma.message.create({
                    data: {
                        userId: socket.userId,
                        modelId: modelId,
                        chatId: chat.id,
                        content: content.trim(),
                        isFromUser: socket.userRole === 'USER'
                    },
                    include: {
                        user: {
                            select: { id: true, email: true }
                        },
                        model: {
                            select: { id: true, name: true, surname: true }
                        }
                    }
                });

                // Broadcast to chat-specific room (not model room)
                io.to(`chat_${chat.id}`).emit('new_message', {
                    id: message.id,
                    content: message.content,
                    isFromUser: message.isFromUser,
                    createdAt: message.createdAt,
                    user: message.user,
                    model: message.model
                });

            } catch (error) {
                console.error('Send message error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle getting chat history
        socket.on('get_chat_history', async (data) => {
            try {
                const { modelId, userId, limit = 50, offset = 0 } = data;

                // Find the chat
                let chat;
                if (socket.userRole === 'MANAGER') {
                    // Manager gets chat for specific user
                    if (!userId) {
                        socket.emit('error', { message: 'userId required for manager' });
                        return;
                    }

                    const manager = await prisma.manager.findUnique({
                        where: { userId: socket.userId },
                        include: { model: true }
                    });

                    if (!manager || !manager.model || manager.model.id !== modelId) {
                        socket.emit('error', { message: 'No access to this model' });
                        return;
                    }

                    chat = await prisma.chat.findFirst({
                        where: {
                            userId: userId,
                            modelId: modelId
                        }
                    });
                } else {
                    // Regular user gets their own chat - check if blocked
                    if (socket.userRole === 'USER') {
                        const model = await prisma.model.findUnique({
                            where: { id: modelId },
                            include: {
                                manager: {
                                    include: {
                                        user: {
                                            select: { id: true }
                                        }
                                    }
                                }
                            }
                        });

                        if (model && model.manager) {
                            const managerUserId = model.manager.user.id;
                            const blockRecord = await prisma.blockedUser.findUnique({
                                where: {
                                    blockedById_blockedUserId: {
                                        blockedById: managerUserId,
                                        blockedUserId: socket.userId
                                    }
                                }
                            });

                            if (blockRecord) {
                                socket.emit('error', { message: 'You are blocked from accessing this model' });
                                return;
                            }
                        }
                    }

                    const subscription = await prisma.subscription.findFirst({
                        where: {
                            userId: socket.userId,
                            modelId: modelId,
                            isActive: true
                        }
                    });

                    if (!subscription && socket.userRole !== 'ADMIN') {
                        socket.emit('error', { message: 'No access to this model' });
                        return;
                    }

                    chat = await prisma.chat.findFirst({
                        where: {
                            userId: socket.userId,
                            modelId: modelId
                        }
                    });
                }

                if (!chat) {
                    socket.emit('chat_history', {
                        modelId,
                        messages: []
                    });
                    return;
                }

                const messages = await prisma.message.findMany({
                    where: { chatId: chat.id },
                    include: {
                        user: {
                            select: { id: true, email: true }
                        },
                        model: {
                            select: { id: true, name: true, surname: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                    skip: offset
                });

                socket.emit('chat_history', {
                    modelId,
                    messages: messages.reverse()
                });

            } catch (error) {
                console.error('Get chat history error:', error);
                socket.emit('error', { message: 'Failed to get chat history' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User ${socket.userId} disconnected`);
        });
    });
};

const getIO = () => io;

module.exports = {
    initializeSocketIO,
    getIO
};
