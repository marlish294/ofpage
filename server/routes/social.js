const express = require('express');
const prisma = require('../config/database');

const router = express.Router();

// Get all models (public)
router.get('/models', async (req, res) => {
    try {
        console.log('Fetching models...');

        const models = await prisma.model.findMany({
            where: { isActive: true },
            include: {
                manager: {
                    include: {
                        user: {
                            select: { isActive: true }
                        }
                    }
                },
                plans: {
                    where: { isActive: true },
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

        console.log(`Found ${models.length} models`);

        // Filter out models from inactive managers
        const activeModels = models.filter(model =>
            model.manager && model.manager.user && model.manager.user.isActive
        );

        console.log(`Returning ${activeModels.length} active models`);

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

        const model = await prisma.model.findUnique({
            where: { id },
            include: {
                manager: {
                    include: {
                        user: {
                            select: { isActive: true }
                        }
                    }
                },
                plans: {
                    where: { isActive: true },
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

        if (!model || !model.isActive || !model.manager.user.isActive) {
            return res.status(404).json({ message: 'Model not found' });
        }

        res.json({ model });
    } catch (error) {
        console.error('Get model error:', error);
        res.status(500).json({ message: 'Failed to fetch model' });
    }
});

// Demo payment processing
router.post('/subscribe', async (req, res) => {
    try {
        const { modelId, planId, paymentData } = req.body;

        // Validate required fields
        if (!modelId || !planId || !paymentData) {
            return res.status(400).json({ message: 'Missing required fields' });
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
