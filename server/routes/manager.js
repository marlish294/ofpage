const express = require('express');
const multer = require('multer');
const prisma = require('../config/database');
const { authenticateToken, requireManager } = require('../middleware/auth');
const { uploadFile } = require('../config/minio');

const router = express.Router();

// All routes require manager authentication
router.use(authenticateToken);
router.use(requireManager);

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed'), false);
        }
    }
});

// Get manager's model
router.get('/model', async (req, res) => {
    try {
        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: {
                model: {
                    include: {
                        plans: {
                            where: { isActive: true },
                            orderBy: { createdAt: 'asc' }
                        }
                    }
                }
            }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'No model found' });
        }

        res.json({ model: manager.model });
    } catch (error) {
        console.error('Get model error:', error);
        res.status(500).json({ message: 'Failed to fetch model' });
    }
});

// Create or update model
router.post('/model', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            name,
            surname,
            bio,
            age,
            hairColor,
            skinColor
        } = req.body;

        // Validate required fields
        if (!name || !surname || !bio || !age || !hairColor || !skinColor) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        let photoUrl = null;
        let videoUrl = null;

        // Handle photo upload
        if (req.files && req.files.photo && req.files.photo[0]) {
            const photoResult = await uploadFile(
                req.files.photo[0].buffer,
                req.files.photo[0].originalname,
                req.files.photo[0].mimetype
            );
            if (photoResult.success) {
                photoUrl = photoResult.url;
            }
        }

        // Handle video upload
        if (req.files && req.files.video && req.files.video[0]) {
            const videoResult = await uploadFile(
                req.files.video[0].buffer,
                req.files.video[0].originalname,
                req.files.video[0].mimetype
            );
            if (videoResult.success) {
                videoUrl = videoResult.url;
            }
        }

        // Create or update model
        let model;
        if (manager.model) {
            // Update existing model
            model = await prisma.model.update({
                where: { id: manager.model.id },
                data: {
                    name,
                    surname,
                    bio,
                    age: parseInt(age),
                    hairColor,
                    skinColor,
                    photoUrl: photoUrl || manager.model.photoUrl,
                    videoUrl: videoUrl || manager.model.videoUrl
                },
                include: {
                    plans: {
                        where: { isActive: true },
                        orderBy: { createdAt: 'asc' }
                    }
                }
            });
        } else {
            // Create new model
            model = await prisma.model.create({
                data: {
                    managerId: manager.id,
                    name,
                    surname,
                    bio,
                    age: parseInt(age),
                    hairColor,
                    skinColor,
                    photoUrl,
                    videoUrl
                },
                include: {
                    plans: {
                        where: { isActive: true },
                        orderBy: { createdAt: 'asc' }
                    }
                }
            });
        }

        res.json({
            message: 'Model saved successfully',
            model
        });

    } catch (error) {
        console.error('Save model error:', error);
        res.status(500).json({ message: 'Failed to save model' });
    }
});

// Create plan
router.post('/plans', async (req, res) => {
    try {
        const { name, description, price, duration } = req.body;

        if (!name || !description || !price || !duration) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        // Check if manager already has 4 plans
        const existingPlans = await prisma.plan.count({
            where: { modelId: manager.model.id, isActive: true }
        });

        if (existingPlans >= 4) {
            return res.status(400).json({ message: 'Maximum 4 plans allowed' });
        }

        const plan = await prisma.plan.create({
            data: {
                modelId: manager.model.id,
                name,
                description,
                price: parseFloat(price),
                duration: parseInt(duration)
            }
        });

        res.status(201).json({
            message: 'Plan created successfully',
            plan
        });

    } catch (error) {
        console.error('Create plan error:', error);
        res.status(500).json({ message: 'Failed to create plan' });
    }
});

// Update plan
router.put('/plans/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, duration } = req.body;

        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        const plan = await prisma.plan.findFirst({
            where: {
                id: id,
                modelId: manager.model.id,
                isActive: true
            }
        });

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        const updatedPlan = await prisma.plan.update({
            where: { id: id },
            data: {
                name: name || plan.name,
                description: description || plan.description,
                price: price ? parseFloat(price) : plan.price,
                duration: duration ? parseInt(duration) : plan.duration
            }
        });

        res.json({
            message: 'Plan updated successfully',
            plan: updatedPlan
        });

    } catch (error) {
        console.error('Update plan error:', error);
        res.status(500).json({ message: 'Failed to update plan' });
    }
});

// Delete plan
router.delete('/plans/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        const plan = await prisma.plan.findFirst({
            where: {
                id: id,
                modelId: manager.model.id,
                isActive: true
            }
        });

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        await prisma.plan.update({
            where: { id: id },
            data: { isActive: false }
        });

        res.json({ message: 'Plan deleted successfully' });

    } catch (error) {
        console.error('Delete plan error:', error);
        res.status(500).json({ message: 'Failed to delete plan' });
    }
});

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
    try {
        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        // Get active subscriptions count
        const activeSubscriptions = await prisma.subscription.count({
            where: {
                modelId: manager.model.id,
                isActive: true
            }
        });

        // Get total revenue
        const subscriptions = await prisma.subscription.findMany({
            where: {
                modelId: manager.model.id,
                isActive: true
            },
            include: {
                plan: {
                    select: { price: true }
                }
            }
        });

        const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.plan.price, 0);

        // Get recent subscriptions (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentSubscriptions = await prisma.subscription.count({
            where: {
                modelId: manager.model.id,
                isActive: true,
                createdAt: {
                    gte: thirtyDaysAgo
                }
            }
        });

        res.json({
            stats: {
                activeSubscriptions,
                totalRevenue,
                recentSubscriptions
            }
        });

    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
});

// Get chat subscribers
router.get('/subscribers', async (req, res) => {
    try {
        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        const subscribers = await prisma.subscription.findMany({
            where: {
                modelId: manager.model.id,
                isActive: true
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        createdAt: true
                    }
                },
                model: {
                    select: { id: true, name: true, surname: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ subscribers });

    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({ message: 'Failed to fetch subscribers' });
    }
});

// Get chat history for manager's model and specific user
router.get('/chats', async (req, res) => {
    try {
        const { limit = 50, offset = 0, userId } = req.query;

        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        // If userId is provided, filter by that specific user's chat
        const whereClause = userId
            ? {
                modelId: manager.model.id,
                userId: userId
            }
            : {
                modelId: manager.model.id
            };

        const messages = await prisma.message.findMany({
            where: whereClause,
            include: {
                user: {
                    select: { id: true, email: true }
                },
                model: {
                    select: { id: true, name: true, surname: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset)
        });

        res.json({
            messages: messages.reverse(),
            hasMore: messages.length === parseInt(limit)
        });

    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({ message: 'Failed to fetch chat history' });
    }
});

// Send message as model
// router.post('/messages', async (req, res) => {
//     try {
//         const { userId, content } = req.body;

//         if (!userId || !content) {
//             return res.status(400).json({ message: 'userId and content are required' });
//         }

//         // Get manager + model
//         const manager = await prisma.manager.findUnique({
//             where: { userId: req.user.id },
//             include: { model: true },
//         });

//         if (!manager || !manager.model) {
//             return res.status(404).json({ message: 'Model not found' });
//         }

//         const modelId = manager.model.id;

//         // ✅ Ensure chat exists (model ↔ user)
//         let chat = await prisma.chat.findFirst({
//             where: {
//                 userId,
//                 modelId,
//             },
//         });

//         if (!chat) {
//             chat = await prisma.chat.create({
//                 data: {
//                     userId,
//                     modelId,
//                 },
//             });
//         }

//         // ✅ Create message inside that chat
//         const message = await prisma.message.create({
//             data: {
//                 userId,
//                 modelId,
//                 chatId: chat.id,
//                 content,
//                 isFromUser: false, // because this is from the model/manager side
//             },
//             include: {
//                 user: { select: { id: true, email: true } },
//                 model: { select: { id: true, name: true, surname: true } },
//             },
//         });

//         // ✅ Emit socket event (if using Socket.IO)
//         const io = req.app.get('io');
//         if (io) {
//             io.to(`chat_${chat.id}`).emit('new_message', message);
//         }

//         res.json({ message });
//     } catch (error) {
//         console.error('Send message error:', error);
//         res.status(500).json({ message: 'Failed to send message' });
//     }
// });

// ✅ Send message as model (manager side)
router.post('/messages', async (req, res) => {
    try {
        const { userId, content } = req.body;

        if (!userId || !content) {
            return res.status(400).json({ message: 'userId and content are required' });
        }

        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        const modelId = manager.model.id;

        // Ensure chat exists
        const chat = await prisma.chat.upsert({
            where: {
                userId_modelId: { userId, modelId }
            },
            update: {},
            create: { userId, modelId }
        });

        // Create message
        const message = await prisma.message.create({
            data: {
                userId,
                modelId,
                chatId: chat.id,
                content,
                isFromUser: false
            },
            include: {
                user: { select: { id: true, email: true } },
                model: { select: { id: true, name: true, surname: true } }
            }
        });

        const io = req.app.get('io');
        if (io) io.to(`chat_${chat.id}`).emit('new_message', message);

        res.json({ message });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});



module.exports = router;
