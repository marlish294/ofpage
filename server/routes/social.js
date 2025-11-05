const express = require('express');
const prisma = require('../config/database');

const router = express.Router();

// Get all models (public)
router.get('/models', async (req, res) => {
    try {
        console.log('Fetching models...');

        // Try to get user ID from token if authenticated
        let userId = null;
        try {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const jwt = require('jsonwebtoken');
                const token = authHeader.substring(7);
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
            }
        } catch (err) {
            // Not authenticated or invalid token, continue as public
        }

        const models = await prisma.model.findMany({
            where: { isActive: true },
            include: {
                manager: {
                    include: {
                        user: {
                            select: { isActive: true, id: true }
                        }
                    }
                },
                plans: {
                    where: { isActive: true },
                    include: {
                        media: {
                            where: {
                                isActive: true
                            },
                            select: {
                                type: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log(`Found ${models.length} models`);

        // Filter out models from inactive managers
        let activeModels = models.filter(model =>
            model.manager && model.manager.user && model.manager.user.isActive
        );

        // If user is authenticated, filter out models where user is blocked
        if (userId) {
            const filteredModels = [];
            for (const model of activeModels) {
                const isBlocked = await isUserBlockedByModel(userId, model.id);
                if (!isBlocked) {
                    filteredModels.push(model);
                }
            }
            activeModels = filteredModels;
        }

        // Calculate photo and video counts for each plan in each model
        activeModels = activeModels.map(model => {
            const plansWithCounts = model.plans.map(plan => {
                const photosCount = plan.media.filter(m => m.type === 'IMAGE').length;
                const videosCount = plan.media.filter(m => m.type === 'VIDEO').length;

                return {
                    id: plan.id,
                    name: plan.name,
                    description: plan.description,
                    price: plan.price,
                    duration: plan.duration,
                    photosCount,
                    videosCount
                };
            });

            return {
                ...model,
                plans: plansWithCounts
            };
        });

        res.json({
            models: activeModels,
            success: true,
            count: activeModels.length
        });
    } catch (error) {
        console.error('Get models error:', error);
        res.status(500).json({
            message: 'Failed to fetch models',
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get single model details (public)
router.get('/models/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Try to get user ID from token if authenticated
        let userId = null;
        try {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const jwt = require('jsonwebtoken');
                const token = authHeader.substring(7);
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
            }
        } catch (err) {
            // Not authenticated or invalid token, continue as public
        }

        const model = await prisma.model.findUnique({
            where: { id },
            include: {
                manager: {
                    include: {
                        user: {
                            select: { isActive: true, id: true }
                        }
                    }
                },
                plans: {
                    where: { isActive: true },
                    include: {
                        media: {
                            where: {
                                isActive: true
                            },
                            select: {
                                type: true
                            }
                        }
                    }
                }
            }
        });

        if (!model || !model.isActive || !model.manager.user.isActive) {
            return res.status(404).json({ message: 'Model not found' });
        }

        // Calculate photo and video counts for each plan
        const plansWithCounts = model.plans.map(plan => {
            const photosCount = plan.media.filter(m => m.type === 'IMAGE').length;
            const videosCount = plan.media.filter(m => m.type === 'VIDEO').length;

            return {
                id: plan.id,
                name: plan.name,
                description: plan.description,
                price: plan.price,
                duration: plan.duration,
                photosCount,
                videosCount
            };
        });

        model.plans = plansWithCounts;

        // If user is authenticated, check if they're blocked
        if (userId) {
            const isBlocked = await isUserBlockedByModel(userId, id);
            if (isBlocked) {
                return res.status(404).json({ message: 'Model not found' });
            }
        }

        res.json({ model });
    } catch (error) {
        console.error('Get model error:', error);
        res.status(500).json({ message: 'Failed to fetch model' });
    }
});

// Helper function to check if user is blocked by model's manager
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

// Demo payment processing
router.post('/subscribe', async (req, res) => {
    try {
        const { modelId, planId, paymentData } = req.body;

        // Validate required fields
        if (!modelId || !planId || !paymentData) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Get user ID from token if available (for authenticated users)
        let userId = null;
        try {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const jwt = require('jsonwebtoken');
                const token = authHeader.substring(7);
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId;
            }
        } catch (err) {
            // Not authenticated, continue with payment processing
        }

        // If user is authenticated, check if they're blocked
        if (userId) {
            const isBlocked = await isUserBlockedByModel(userId, modelId);
            if (isBlocked) {
                return res.status(403).json({ message: 'You are blocked from subscribing to this model' });
            }
        }

        // Verify model and plan exist
        const model = await prisma.model.findUnique({
            where: { id: modelId, isActive: true },
            include: {
                plans: {
                    where: { id: planId, isActive: true }
                }
            }
        });

        if (!model || model.plans.length === 0) {
            return res.status(404).json({ message: 'Model or plan not found' });
        }

        const plan = model.plans[0];

        // Demo payment validation (accept any card data)
        if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
            return res.status(400).json({ message: 'Invalid payment data' });
        }

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Return success (in real app, this would process actual payment)
        res.json({
            message: 'Subscription approved!',
            subscription: {
                modelId,
                planId,
                price: plan.price,
                duration: plan.duration
            }
        });

    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ message: 'Subscription failed' });
    }
});

module.exports = router;
