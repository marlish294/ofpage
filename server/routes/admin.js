const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Get dashboard overview
// router.get('/dashboard', async (req, res) => {
//     try {
//         // Total revenue across all managers
//         const allSubscriptions = await prisma.subscription.findMany({
//             where: { isActive: true },
//             include: {
//                 plan: {
//                     select: { price: true }
//                 }
//             }
//         });

//         const totalRevenue = allSubscriptions.reduce((sum, sub) => sum + sub.plan.price, 0);

//         // Total subscriber count
//         // const totalSubscribers = await prisma.subscription.count({
//         //     where: { isActive: true },
//         //     distinct: ['userId']
//         // });
//         const distinctSubscribers = await prisma.subscription.findMany({
//             where: { isActive: true },
//             distinct: ['userId'],
//             select: { userId: true }
//         });
//         const totalSubscribers = distinctSubscribers.length;

//         // Total managers count
//         const totalManagers = await prisma.manager.count({
//             where: { isApproved: true }
//         });

//         // Total models count
//         const totalModels = await prisma.model.count({
//             where: { isActive: true }
//         });

//         // Pending manager approvals
//         const pendingManagers = await prisma.manager.count({
//             where: { isApproved: false }
//         });

//         res.json({
//             stats: {
//                 totalRevenue,
//                 totalSubscribers,
//                 totalManagers,
//                 totalModels,
//                 pendingManagers
//             }
//         });

//     } catch (error) {
//         console.error('Get admin dashboard error:', error);
//         res.status(500).json({ message: 'Failed to fetch dashboard data' });
//     }
// });
// Get dashboard overview
router.get('/dashboard', async (req, res) => {
    try {
        // Total revenue across all managers
        const allSubscriptions = await prisma.subscription.findMany({
            where: { isActive: true },
            include: {
                plan: {
                    select: { price: true }
                }
            }
        });

        const totalRevenue = allSubscriptions.reduce((sum, sub) => sum + sub.plan.price, 0);

        // ✅ Total subscriber count (fixed for Prisma 5+)
        const distinctSubscribers = await prisma.subscription.findMany({
            where: { isActive: true },
            distinct: ['userId'],
            select: { userId: true }
        });
        const totalSubscribers = distinctSubscribers.length;

        // Total managers count
        const totalManagers = await prisma.manager.count({
            where: { isApproved: true }
        });

        // Total models count
        const totalModels = await prisma.model.count({
            where: { isActive: true }
        });

        // Pending manager approvals
        const pendingManagers = await prisma.manager.count({
            where: { isApproved: false }
        });

        res.json({
            stats: {
                totalRevenue,
                totalSubscribers,
                totalManagers,
                totalModels,
                pendingManagers
            }
        });

    } catch (error) {
        console.error('Get admin dashboard error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
});

// Get pending manager approvals
router.get('/pending-managers', async (req, res) => {
    try {
        const pendingManagers = await prisma.manager.findMany({
            where: { isApproved: false },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        createdAt: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        res.json({ pendingManagers });

    } catch (error) {
        console.error('Get pending managers error:', error);
        res.status(500).json({ message: 'Failed to fetch pending managers' });
    }
});

// Approve manager
router.post('/approve-manager/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const manager = await prisma.manager.findUnique({
            where: { id: id },
            include: { user: true }
        });

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        if (manager.isApproved) {
            return res.status(400).json({ message: 'Manager already approved' });
        }

        await prisma.manager.update({
            where: { id: id },
            data: { isApproved: true }
        });

        res.json({ message: 'Manager approved successfully' });

    } catch (error) {
        console.error('Approve manager error:', error);
        res.status(500).json({ message: 'Failed to approve manager' });
    }
});

// Reject manager
router.delete('/reject-manager/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const manager = await prisma.manager.findUnique({
            where: { id: id },
            include: { user: true }
        });

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        // Delete the manager and associated user
        await prisma.user.delete({
            where: { id: manager.userId }
        });

        res.json({ message: 'Manager rejected and account deleted' });

    } catch (error) {
        console.error('Reject manager error:', error);
        res.status(500).json({ message: 'Failed to reject manager' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const { role, page = 1, limit = 20 } = req.query;

        const where = {};
        if (role) {
            where.role = role;
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                manager: {
                    select: {
                        id: true,
                        isApproved: true,
                        model: {
                            select: {
                                id: true,
                                name: true,
                                surname: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit)
        });

        const total = await prisma.user.count({ where });

        res.json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// Block/Unblock user
router.post('/users/:id/block', async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'ADMIN') {
            return res.status(400).json({ message: 'Cannot block admin user' });
        }

        await prisma.user.update({
            where: { id: id },
            data: { isActive: isActive }
        });

        res.json({
            message: isActive ? 'User unblocked successfully' : 'User blocked successfully'
        });

    } catch (error) {
        console.error('Block user error:', error);
        res.status(500).json({ message: 'Failed to update user status' });
    }
});

// Get all models
router.get('/models', async (req, res) => {
    try {
        const models = await prisma.model.findMany({
            include: {
                manager: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                isActive: true
                            }
                        }
                    }
                },
                plans: {
                    where: { isActive: true }
                },
                _count: {
                    select: {
                        subscriptions: {
                            where: { isActive: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ models });

    } catch (error) {
        console.error('Get models error:', error);
        res.status(500).json({ message: 'Failed to fetch models' });
    }
});

// Block/Unblock model
router.post('/models/:id/block', async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const model = await prisma.model.findUnique({
            where: { id: id }
        });

        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        await prisma.model.update({
            where: { id: id },
            data: { isActive: isActive }
        });

        res.json({
            message: isActive ? 'Model unblocked successfully' : 'Model blocked successfully'
        });

    } catch (error) {
        console.error('Block model error:', error);
        res.status(500).json({ message: 'Failed to update model status' });
    }
});

// Get all chats (view-only)
router.get('/chats', async (req, res) => {
    try {
        const { modelId, page = 1, limit = 50 } = req.query;

        const where = {};
        if (modelId) {
            where.modelId = modelId;
        }

        const messages = await prisma.message.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true
                    }
                },
                model: {
                    select: {
                        id: true,
                        name: true,
                        surname: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit)
        });

        const total = await prisma.message.count({ where });

        res.json({
            messages: messages.reverse(),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get chats error:', error);
        res.status(500).json({ message: 'Failed to fetch chats' });
    }
});

// Change admin password
router.post('/change-password', async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Change admin password error:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
});

// Get all chat messages (admin can see all)
router.get('/messages', async (req, res) => {
    try {
        const { limit = 50, offset = 0, modelId } = req.query;

        const where = {};
        if (modelId) {
            where.modelId = modelId;
        }

        const messages = await prisma.message.findMany({
            where,
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
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});

module.exports = router;
