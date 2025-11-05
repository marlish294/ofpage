// const express = require('express');
// const prisma = require('../config/database');
// const { authenticateToken, requireRole } = require('../middleware/auth');

// const router = express.Router();

// // All routes require authentication
// router.use(authenticateToken);

// // Get user's subscriptions
// router.get('/subscriptions', async (req, res) => {
//     try {
//         const subscriptions = await prisma.subscription.findMany({
//             where: {
//                 userId: req.user.id,
//                 isActive: true
//             },
//             include: {
//                 model: {
//                     select: {
//                         id: true,
//                         name: true,
//                         surname: true,
//                         bio: true,
//                         age: true,
//                         hairColor: true,
//                         skinColor: true,
//                         photoUrl: true,
//                         videoUrl: true
//                     }
//                 },
//                 plan: {
//                     select: {
//                         id: true,
//                         name: true,
//                         description: true,
//                         price: true,
//                         duration: true
//                     }
//                 }
//             },
//             orderBy: { createdAt: 'desc' }
//         });

//         res.json({ subscriptions });
//     } catch (error) {
//         console.error('Get subscriptions error:', error);
//         res.status(500).json({ message: 'Failed to fetch subscriptions' });
//     }
// });

// // Subscribe to a model
// router.post('/subscribe', async (req, res) => {
//     try {
//         const { modelId, planId } = req.body;

//         if (!modelId || !planId) {
//             return res.status(400).json({ message: 'Model ID and Plan ID are required' });
//         }

//         // Check if already subscribed
//         const existingSubscription = await prisma.subscription.findFirst({
//             where: {
//                 userId: req.user.id,
//                 modelId: modelId,
//                 isActive: true
//             }
//         });

//         if (existingSubscription) {
//             return res.status(400).json({ message: 'Already subscribed to this model' });
//         }

//         // Verify model and plan exist
//         const model = await prisma.model.findUnique({
//             where: { id: modelId, isActive: true },
//             include: {
//                 plans: {
//                     where: { id: planId, isActive: true }
//                 }
//             }
//         });

//         if (!model || model.plans.length === 0) {
//             return res.status(404).json({ message: 'Model or plan not found' });
//         }

//         const plan = model.plans[0];

//         // Calculate end date
//         const endDate = new Date();
//         endDate.setDate(endDate.getDate() + plan.duration);

//         // Create subscription
//         const subscription = await prisma.subscription.create({
//             data: {
//                 userId: req.user.id,
//                 modelId: modelId,
//                 planId: planId,
//                 endDate: endDate
//             },
//             include: {
//                 model: {
//                     select: {
//                         id: true,
//                         name: true,
//                         surname: true,
//                         bio: true,
//                         age: true,
//                         hairColor: true,
//                         skinColor: true,
//                         photoUrl: true,
//                         videoUrl: true
//                     }
//                 },
//                 plan: {
//                     select: {
//                         id: true,
//                         name: true,
//                         description: true,
//                         price: true,
//                         duration: true
//                     }
//                 }
//             }
//         });

//         res.status(201).json({
//             message: 'Subscription created successfully',
//             subscription
//         });

//     } catch (error) {
//         console.error('Subscribe error:', error);
//         res.status(500).json({ message: 'Subscription failed' });
//     }
// });

// // Cancel subscription
// router.delete('/subscriptions/:id', async (req, res) => {
//     try {
//         const { id } = req.params;

//         const subscription = await prisma.subscription.findFirst({
//             where: {
//                 id: id,
//                 userId: req.user.id,
//                 isActive: true
//             }
//         });

//         if (!subscription) {
//             return res.status(404).json({ message: 'Subscription not found' });
//         }

//         await prisma.subscription.update({
//             where: { id: id },
//             data: { isActive: false }
//         });

//         res.json({ message: 'Subscription cancelled successfully' });

//     } catch (error) {
//         console.error('Cancel subscription error:', error);
//         res.status(500).json({ message: 'Failed to cancel subscription' });
//     }
// });

// // Get subscribed models for chat
// router.get('/chat-models', async (req, res) => {
//     try {
//         const subscriptions = await prisma.subscription.findMany({
//             where: {
//                 userId: req.user.id,
//                 isActive: true
//             },
//             include: {
//                 model: {
//                     select: {
//                         id: true,
//                         name: true,
//                         surname: true,
//                         photoUrl: true
//                     }
//                 }
//             },
//             orderBy: { createdAt: 'desc' }
//         });

//         const chatModels = subscriptions.map(sub => ({
//             id: sub.model.id,
//             name: sub.model.name,
//             surname: sub.model.surname,
//             photoUrl: sub.model.photoUrl,
//             subscriptionId: sub.id
//         }));

//         res.json({ chatModels });
//     } catch (error) {
//         console.error('Get chat models error:', error);
//         res.status(500).json({ message: 'Failed to fetch chat models' });
//     }
// });

// // Get chat history
// router.get('/chats/:modelId', async (req, res) => {
//     try {
//         const { modelId } = req.params;
//         const { limit = 50, offset = 0 } = req.query;

//         // Verify user has access to this model
//         const subscription = await prisma.subscription.findFirst({
//             where: {
//                 userId: req.user.id,
//                 modelId: modelId,
//                 isActive: true
//             }
//         });

//         if (!subscription) {
//             return res.status(403).json({ message: 'No access to this model' });
//         }

//         const messages = await prisma.message.findMany({
//             where: { modelId },
//             include: {
//                 user: {
//                     select: { id: true, email: true }
//                 },
//                 model: {
//                     select: { id: true, name: true, surname: true }
//                 }
//             },
//             orderBy: { createdAt: 'desc' },
//             take: parseInt(limit),
//             skip: parseInt(offset)
//         });

//         res.json({
//             messages: messages.reverse(),
//             hasMore: messages.length === parseInt(limit)
//         });

//     } catch (error) {
//         console.error('Get chat history error:', error);
//         res.status(500).json({ message: 'Failed to fetch chat history' });
//     }
// });

// // Send message
// // router.post('/messages', async (req, res) => {
// //     try {
// //         const { modelId, content } = req.body;

// //         if (!modelId || !content) {
// //             return res.status(400).json({ message: 'Model ID and content are required' });
// //         }

// //         // Verify user has access to this model
// //         const subscription = await prisma.subscription.findFirst({
// //             where: {
// //                 userId: req.user.id,
// //                 modelId: modelId,
// //                 isActive: true
// //             }
// //         });

// //         if (!subscription) {
// //             return res.status(403).json({ message: 'No access to this model' });
// //         }

// //         // Create message
// //         const message = await prisma.message.create({
// //             data: {
// //                 userId: req.user.id,
// //                 modelId: modelId,
// //                 content: content,
// //                 isFromUser: true
// //             },
// //             include: {
// //                 user: {
// //                     select: { id: true, email: true }
// //                 },
// //                 model: {
// //                     select: { id: true, name: true, surname: true }
// //                 }
// //             }
// //         });

// //         // Emit to Socket.IO room
// //         const io = req.app.get('io');
// //         if (io) {
// //             io.to(`chat_${modelId}`).emit('new_message', message);
// //         }

// //         res.json({ message });

// //     } catch (error) {
// //         console.error('Send message error:', error);
// //         res.status(500).json({ message: 'Failed to send message' });
// //     }
// // });

// // Send message
// router.post('/messages', async (req, res) => {
//     try {
//         const { modelId, content } = req.body;

//         if (!modelId || !content) {
//             return res.status(400).json({ message: 'Model ID and content are required' });
//         }

//         // Verify user has access to this model
//         const subscription = await prisma.subscription.findFirst({
//             where: {
//                 userId: req.user.id,
//                 modelId: modelId,
//                 isActive: true
//             }
//         });

//         if (!subscription) {
//             return res.status(403).json({ message: 'No access to this model' });
//         }

//         // Ensure chat exists or create one
//         let chat = await prisma.chat.findFirst({
//             where: {
//                 userId: req.user.id,
//                 modelId: modelId
//             }
//         });

//         if (!chat) {
//             chat = await prisma.chat.create({
//                 data: {
//                     userId: req.user.id,
//                     modelId: modelId
//                 }
//             });
//         }

//         // ✅ Create message with chatId attached
//         const message = await prisma.message.create({
//             data: {
//                 userId: req.user.id,
//                 modelId: modelId,
//                 chatId: chat.id,
//                 content: content,
//                 isFromUser: true
//             },
//             include: {
//                 user: { select: { id: true, email: true } },
//                 model: { select: { id: true, name: true, surname: true } }
//             }
//         });

//         // Emit to Socket.IO room
//         const io = req.app.get('io');
//         if (io) {
//             io.to(`chat_${modelId}`).emit('new_message', message);
//         }

//         res.json({ message });
//     } catch (error) {
//         console.error('Send message error:', error);
//         res.status(500).json({ message: 'Failed to send message' });
//     }
// });

// module.exports = router;
// ==========================
// File: /Users/admin/Desktop/newnew/server/routes/user.js
// ==========================
const express = require('express');
const prisma = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// ======================================================
// 📦 Get user's active subscriptions
// ======================================================
router.get('/subscriptions', async (req, res) => {
    try {
        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId: req.user.id,
                isActive: true
            },
            include: {
                model: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        bio: true,
                        age: true,
                        hairColor: true,
                        skinColor: true,
                        photoUrl: true,
                        videoUrl: true
                    }
                },
                plan: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        duration: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Filter out subscriptions to models where user is blocked
        const filteredSubscriptions = [];
        for (const sub of subscriptions) {
            if (!sub.model) continue;
            const isBlocked = await isUserBlockedByModel(req.user.id, sub.model.id);
            if (!isBlocked) {
                filteredSubscriptions.push(sub);
            }
        }

        res.json({ subscriptions: filteredSubscriptions });
    } catch (error) {
        console.error('Get subscriptions error:', error);
        res.status(500).json({ message: 'Failed to fetch subscriptions' });
    }
});

// ======================================================
// Helper function to check if user is blocked by model's manager
// ======================================================
async function isUserBlockedByModel(userId, modelId) {
    try {
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

        if (!model || !model.manager) {
            return false;
        }

        const managerUserId = model.manager.user.id;

        const blockRecord = await prisma.blockedUser.findUnique({
            where: {
                blockedById_blockedUserId: {
                    blockedById: managerUserId,
                    blockedUserId: userId
                }
            }
        });

        return !!blockRecord;
    } catch (error) {
        console.error('Error checking block status:', error);
        return false;
    }
}

// ======================================================
// 💳 Subscribe to a model
// ======================================================
router.post('/subscribe', async (req, res) => {
    try {
        const { modelId, planId } = req.body;

        if (!modelId || !planId) {
            return res.status(400).json({ message: 'Model ID and Plan ID are required' });
        }

        // Check if user is blocked by the model's manager
        const isBlocked = await isUserBlockedByModel(req.user.id, modelId);
        if (isBlocked) {
            return res.status(403).json({ message: 'You are blocked from subscribing to this model' });
        }

        // Optional: prevent duplicate subscription to the exact same plan
        const existingSubscription = await prisma.subscription.findFirst({
            where: {
                userId: req.user.id,
                planId,
                isActive: true
            }
        });

        if (existingSubscription) {
            return res.status(400).json({ message: 'Already subscribed to this plan' });
        }

        // Verify model and plan exist
        const model = await prisma.model.findUnique({
            where: { id: modelId, isActive: true },
            include: {
                plans: { where: { id: planId, isActive: true } }
            }
        });

        if (!model || model.plans.length === 0) {
            return res.status(404).json({ message: 'Model or plan not found' });
        }

        const plan = model.plans[0];

        // Calculate end date
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.duration);

        // Create subscription
        const subscription = await prisma.subscription.create({
            data: {
                userId: req.user.id,
                modelId,
                planId,
                amountPaid: plan.price,
                endDate
            },
            include: {
                model: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        bio: true,
                        age: true,
                        hairColor: true,
                        skinColor: true,
                        photoUrl: true,
                        videoUrl: true
                    }
                },
                plan: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        duration: true
                    }
                }
            }
        });
        // ✅ Automatically create private chat for user ↔ model (single per user-model)
        const ensuredChat = await prisma.chat.upsert({
            where: {
                userId_modelId: {
                    userId: req.user.id,
                    modelId: modelId
                }
            },
            update: {},
            create: {
                userId: req.user.id,
                modelId: modelId
            }
        });

        // Cleanup: if any duplicate chats exist due to historical data, remove them now
        try {
            const duplicates = await prisma.chat.findMany({
                where: { userId: req.user.id, modelId: modelId }
            });
            const idsToDelete = duplicates.filter(c => c.id !== ensuredChat.id).map(c => c.id);
            if (idsToDelete.length > 0) {
                await prisma.message.deleteMany({ where: { chatId: { in: idsToDelete } } });
                await prisma.chat.deleteMany({ where: { id: { in: idsToDelete } } });
            }
        } catch (cleanupErr) {
            console.warn('Chat cleanup warning:', cleanupErr?.message || cleanupErr);
        }

        res.status(201).json({
            message: 'Subscription created successfully',
            subscription
        });

    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ message: 'Subscription failed' });
    }
});

// ======================================================
// ❌ Cancel subscription
// ======================================================
router.delete('/subscriptions/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const subscription = await prisma.subscription.findFirst({
            where: {
                id,
                userId: req.user.id,
                isActive: true
            }
        });

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        await prisma.subscription.update({
            where: { id },
            data: { isActive: false }
        });

        res.json({ message: 'Subscription cancelled successfully' });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({ message: 'Failed to cancel subscription' });
    }
});

// ======================================================
// 💬 Get models user can chat with
// ======================================================
router.get('/chat-models', async (req, res) => {
    try {
        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId: req.user.id,
                isActive: true
            },
            include: {
                model: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        photoUrl: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Deduplicate by model.id and filter out blocked models
        const seenModelIds = new Set();
        const chatModels = [];
        for (const sub of subscriptions) {
            if (!sub.model) continue;
            if (seenModelIds.has(sub.model.id)) continue;

            // Check if user is blocked by this model's manager
            const isBlocked = await isUserBlockedByModel(req.user.id, sub.model.id);
            if (isBlocked) continue; // Skip blocked models

            seenModelIds.add(sub.model.id);
            chatModels.push({
                id: sub.model.id,
                name: sub.model.name,
                surname: sub.model.surname,
                photoUrl: sub.model.photoUrl
            });
        }

        res.json({ chatModels });
    } catch (error) {
        console.error('Get chat models error:', error);
        res.status(500).json({ message: 'Failed to fetch chat models' });
    }
});

// ======================================================
// 💬 Get chat history between user & model
// ======================================================
router.get('/chats/:modelId', async (req, res) => {
    try {
        const { modelId } = req.params;
        const { limit = 50, offset = 0 } = req.query;

        // Check if user is blocked by the model's manager
        const isBlocked = await isUserBlockedByModel(req.user.id, modelId);
        if (isBlocked) {
            return res.status(403).json({ message: 'You are blocked from accessing this model' });
        }

        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: req.user.id,
                modelId,
                isActive: true
            }
        });

        if (!subscription) {
            return res.status(403).json({ message: 'No access to this model' });
        }

        // Find or create the chat
        let chat = await prisma.chat.findFirst({
            where: { userId: req.user.id, modelId }
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: { userId: req.user.id, modelId }
            });
        }

        // Get messages only for this specific chat
        const messages = await prisma.message.findMany({
            where: { chatId: chat.id },
            include: {
                user: { select: { id: true, email: true } },
                model: { select: { id: true, name: true, surname: true } }
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

// ======================================================
// 💌 Send message (user → model) with chatId included
// ======================================================
router.post('/messages', async (req, res) => {
    try {
        const { modelId, content } = req.body;

        if (!modelId || !content) {
            return res.status(400).json({ message: 'Model ID and content are required' });
        }

        // Check if user is blocked by the model's manager
        const isBlocked = await isUserBlockedByModel(req.user.id, modelId);
        if (isBlocked) {
            return res.status(403).json({ message: 'You are blocked from messaging this model' });
        }

        // Verify subscription
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: req.user.id,
                modelId,
                isActive: true
            }
        });

        if (!subscription) {
            return res.status(403).json({ message: 'No access to this model' });
        }

        // Find or create chat
        let chat = await prisma.chat.findFirst({
            where: { userId: req.user.id, modelId }
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: { userId: req.user.id, modelId }
            });
        }

        // Create message with chatId
        const message = await prisma.message.create({
            data: {
                userId: req.user.id,
                modelId,
                chatId: chat.id,
                content,
                isFromUser: true
            },
            include: {
                user: { select: { id: true, email: true } },
                model: { select: { id: true, name: true, surname: true } }
            }
        });

        // Emit to socket.io
        const io = req.app.get('io');
        if (io) io.to(`chat_${chat.id}`).emit('new_message', message);

        res.json({ message });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

// ======================================================
// 🔓 Get media for a plan (requires active subscription)
// ======================================================
router.get('/plans/:planId/media', async (req, res) => {
    try {
        const { planId } = req.params;

        // Ensure plan exists and is active
        const plan = await prisma.plan.findFirst({
            where: { id: planId, isActive: true },
            include: { model: true }
        });
        if (!plan || !plan.model || !plan.model.isActive) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // Check if user is blocked by the model's manager
        const isBlocked = await isUserBlockedByModel(req.user.id, plan.model.id);
        if (isBlocked) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // Verify user has an active subscription for this plan
        const activeSubscription = await prisma.subscription.findFirst({
            where: {
                userId: req.user.id,
                planId: planId,
                isActive: true,
                endDate: { gte: new Date() }
            }
        });

        if (!activeSubscription) {
            return res.status(403).json({ message: 'No access to this plan' });
        }

        const media = await prisma.media.findMany({
            where: { planId: planId, isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ media });
    } catch (error) {
        console.error('Get plan media error:', error);
        res.status(500).json({ message: 'Failed to fetch media' });
    }
});

// ======================================================
// 🔓 Get ALL media for a model, aggregated across user's active plan subscriptions
// ======================================================
router.get('/models/:modelId/media', async (req, res) => {
    try {
        const { modelId } = req.params;

        // Check if user is blocked by the model's manager
        const isBlocked = await isUserBlockedByModel(req.user.id, modelId);
        if (isBlocked) {
            return res.status(404).json({ message: 'Model not found' });
        }

        // Ensure model exists and is active
        const model = await prisma.model.findFirst({ where: { id: modelId, isActive: true } });
        if (!model) return res.status(404).json({ message: 'Model not found' });

        // Find user's active subscriptions for this model (not expired)
        const activeSubs = await prisma.subscription.findMany({
            where: {
                userId: req.user.id,
                modelId: modelId,
                isActive: true,
                endDate: { gte: new Date() }
            },
            select: { planId: true }
        });

        if (activeSubs.length === 0) {
            return res.status(403).json({ message: 'No active subscription for this model' });
        }

        const planIds = activeSubs.map(s => s.planId);

        // Fetch media for all subscribed plans
        const media = await prisma.media.findMany({
            where: { planId: { in: planIds }, isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        // Optional: include plan metadata for grouping on UI
        const plans = await prisma.plan.findMany({
            where: { id: { in: planIds } },
            select: { id: true, name: true, description: true, price: true, duration: true }
        });

        res.json({ media, plans });
    } catch (error) {
        console.error('Get model media (aggregate) error:', error);
        res.status(500).json({ message: 'Failed to fetch media' });
    }
});

module.exports = router;
