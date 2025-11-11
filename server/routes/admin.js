const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { formatMessages } = require('../utils/messageFormatter');
const { buildSubscriptionEntry, buildUnlockEntry } = require('../utils/revenue');
const { getAdminEvents } = require('../utils/adminEvents');

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

router.get('/activity-events', (req, res) => {
    try {
        res.json({ events: getAdminEvents() });
    } catch (error) {
        console.error('Get admin activity events error:', error);
        res.status(500).json({ message: 'Failed to fetch activity events' });
    }
});

// Get dashboard overview
router.get('/dashboard', async (req, res) => {
    try {
        // Total revenue across all managers
        const allSubscriptions = await prisma.subscription.findMany({
            where: { isActive: true },
            select: { amountPaid: true }
        });

        const subscriptionRevenue = allSubscriptions.reduce((sum, sub) => sum + (sub.amountPaid || 0), 0);

        const mediaUnlocks = await prisma.messageMediaUnlock.findMany({
            select: { amountPaid: true }
        });

        const mediaUnlockRevenue = mediaUnlocks.reduce((sum, unlock) => sum + (unlock.amountPaid || 0), 0);
        const totalRevenue = subscriptionRevenue + mediaUnlockRevenue;

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
                pendingManagers,
                subscriptionRevenue,
                mediaUnlockRevenue,
                mediaUnlockCount: mediaUnlocks.length
            }
        });

    } catch (error) {
        console.error('Get admin dashboard error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
});

router.get('/revenue/models', async (req, res) => {
    try {
        const models = await prisma.model.findMany({
            where: { isActive: true },
            select: { id: true, name: true, surname: true },
            orderBy: { name: 'asc' }
        });

        const formatted = models.map(model => ({
            id: model.id,
            name: [model.name, model.surname].filter(Boolean).join(' ')
        }));

        res.json({ models: formatted });
    } catch (error) {
        console.error('Get revenue models error:', error);
        res.status(500).json({ message: 'Failed to fetch revenue models' });
    }
});

router.get('/revenue/summary', async (req, res) => {
    try {
        const now = new Date();
        const requestedYear = parseInt(req.query.year, 10);
        const year = Number.isInteger(requestedYear) ? requestedYear : now.getFullYear();

        const startOfYear = new Date(year, 0, 1);
        const startOfNextYear = new Date(year + 1, 0, 1);

        const [
            subscriptions,
            unlocks,
            earliestSubscription,
            earliestUnlock,
            latestSubscription,
            latestUnlock
        ] = await Promise.all([
            prisma.subscription.findMany({
                where: {
                    createdAt: {
                        gte: startOfYear,
                        lt: startOfNextYear
                    }
                },
                select: {
                    amountPaid: true,
                    createdAt: true
                }
            }),
            prisma.messageMediaUnlock.findMany({
                where: {
                    createdAt: {
                        gte: startOfYear,
                        lt: startOfNextYear
                    }
                },
                select: {
                    amountPaid: true,
                    createdAt: true
                }
            }),
            prisma.subscription.findFirst({
                orderBy: { createdAt: 'asc' },
                select: { createdAt: true }
            }),
            prisma.messageMediaUnlock.findFirst({
                orderBy: { createdAt: 'asc' },
                select: { createdAt: true }
            }),
            prisma.subscription.findFirst({
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true }
            }),
            prisma.messageMediaUnlock.findFirst({
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true }
            })
        ]);

        const monthLabels = Array.from({ length: 12 }, (_, index) =>
            new Date(year, index).toLocaleString('default', { month: 'long' })
        );

        const months = Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            label: monthLabels[index],
            total: 0,
            subscriptionTotal: 0,
            unlockTotal: 0,
            growth: null
        }));

        const accumulate = (records, key) => {
            records.forEach(record => {
                const date = new Date(record.createdAt);
                if (Number.isNaN(date.getTime())) {
                    return;
                }
                const monthIndex = date.getMonth();
                const amount = record.amountPaid || 0;

                months[monthIndex].total += amount;
                if (key === 'subscription') {
                    months[monthIndex].subscriptionTotal += amount;
                } else {
                    months[monthIndex].unlockTotal += amount;
                }
            });
        };

        accumulate(subscriptions, 'subscription');
        accumulate(unlocks, 'unlock');

        months.forEach((month, index) => {
            if (index === 0) {
                month.growth = null;
                return;
            }
            const previous = months[index - 1];
            if (!previous || previous.total === 0) {
                month.growth = previous && previous.total === 0 && month.total === 0 ? 0 : null;
                return;
            }

            const delta = month.total - previous.total;
            month.growth = (delta / previous.total) * 100;
        });

        const totals = months.reduce(
            (accumulator, month) => {
                accumulator.totalRevenue += month.total;
                accumulator.subscriptionRevenue += month.subscriptionTotal;
                accumulator.unlockRevenue += month.unlockTotal;
                return accumulator;
            },
            {
                totalRevenue: 0,
                subscriptionRevenue: 0,
                unlockRevenue: 0
            }
        );

        const collector = [];
        if (earliestSubscription?.createdAt) collector.push(new Date(earliestSubscription.createdAt));
        if (earliestUnlock?.createdAt) collector.push(new Date(earliestUnlock.createdAt));
        if (latestSubscription?.createdAt) collector.push(new Date(latestSubscription.createdAt));
        if (latestUnlock?.createdAt) collector.push(new Date(latestUnlock.createdAt));

        let minYear = year;
        let maxYear = year;

        if (collector.length > 0) {
            const validDates = collector.filter(date => !Number.isNaN(date.getTime()));
            if (validDates.length > 0) {
                minYear = Math.min(...validDates.map(date => date.getFullYear()));
                maxYear = Math.max(...validDates.map(date => date.getFullYear()));
            }
        }

        const availableYears = [];
        for (let cursor = minYear; cursor <= maxYear; cursor += 1) {
            availableYears.push(cursor);
        }

        if (!availableYears.includes(year)) {
            availableYears.push(year);
        }

        availableYears.sort((a, b) => a - b);

        res.json({
            year,
            months,
            totals,
            availableYears
        });
    } catch (error) {
        console.error('Get revenue summary error:', error);
        res.status(500).json({ message: 'Failed to fetch revenue summary' });
    }
});

router.get('/revenue/entries', async (req, res) => {
    try {
        const {
            modelId,
            type,
            startDate,
            endDate,
            search = '',
            sortBy = 'date',
            sortOrder = 'desc',
            page = 1,
            limit = 25
        } = req.query;

        const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 25, 1), 100);
        const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
        const offset = (parsedPage - 1) * parsedLimit;

        const startDateObj = startDate ? new Date(startDate) : null;
        const endDateObj = endDate ? new Date(endDate) : null;

        if (startDateObj && Number.isNaN(startDateObj.getTime())) {
            return res.status(400).json({ message: 'Invalid startDate value' });
        }

        if (endDateObj && Number.isNaN(endDateObj.getTime())) {
            return res.status(400).json({ message: 'Invalid endDate value' });
        }

        if (startDateObj && endDateObj && startDateObj > endDateObj) {
            return res.status(400).json({ message: 'startDate cannot be after endDate' });
        }

        const dateFilter = {};
        if (startDateObj) {
            dateFilter.gte = startDateObj;
        }
        if (endDateObj) {
            const inclusiveEnd = new Date(endDateObj);
            inclusiveEnd.setHours(23, 59, 59, 999);
            dateFilter.lte = inclusiveEnd;
        }

        const subscriptionWhere = {};
        const unlockWhere = {};

        if (Object.keys(dateFilter).length > 0) {
            subscriptionWhere.createdAt = dateFilter;
            unlockWhere.createdAt = dateFilter;
        }

        if (modelId) {
            subscriptionWhere.modelId = modelId;
            unlockWhere.media = {
                message: {
                    modelId
                }
            };
        }

        const fetchSubscriptions = type === 'unlock'
            ? Promise.resolve([])
            : prisma.subscription.findMany({
                where: subscriptionWhere,
                include: {
                    model: {
                        select: { id: true, name: true, surname: true }
                    },
                    user: {
                        select: { id: true, email: true }
                    },
                    plan: {
                        select: { id: true, name: true }
                    }
                }
            });

        const fetchUnlocks = type === 'subscription'
            ? Promise.resolve([])
            : prisma.messageMediaUnlock.findMany({
                where: unlockWhere,
                include: {
                    user: {
                        select: { id: true, email: true }
                    },
                    media: {
                        include: {
                            message: {
                                select: {
                                    id: true,
                                    modelId: true,
                                    model: {
                                        select: { id: true, name: true, surname: true }
                                    }
                                }
                            }
                        }
                    }
                }
            });

        const [subscriptions, unlocks] = await Promise.all([fetchSubscriptions, fetchUnlocks]);

        const entries = [
            ...subscriptions.map(buildSubscriptionEntry),
            ...unlocks.map(buildUnlockEntry)
        ].filter(Boolean);

        const normalizedSearch = search.trim().toLowerCase();
        const searchedEntries = normalizedSearch
            ? entries.filter(entry => {
                const modelName = entry.modelName?.toLowerCase() || '';
                const userName = entry.userName?.toLowerCase() || '';
                return modelName.includes(normalizedSearch) || userName.includes(normalizedSearch);
            })
            : entries;

        const orderedEntries = searchedEntries.sort((a, b) => {
            const direction = sortOrder === 'asc' ? 1 : -1;

            if (sortBy === 'amount') {
                return (a.amount - b.amount) * direction;
            }

            const aDate = new Date(a.date).getTime();
            const bDate = new Date(b.date).getTime();
            return (aDate - bDate) * direction;
        });

        const totals = orderedEntries.reduce(
            (accumulator, entry) => {
                const amount = entry.amount || 0;
                accumulator.total += amount;
                if (entry.type === 'subscription') {
                    accumulator.subscription += amount;
                } else if (entry.type === 'unlock') {
                    accumulator.unlock += amount;
                }
                return accumulator;
            },
            { total: 0, subscription: 0, unlock: 0 }
        );

        const paginatedEntries = orderedEntries.slice(offset, offset + parsedLimit);

        res.json({
            entries: paginatedEntries,
            totals,
            pagination: {
                page: parsedPage,
                limit: parsedLimit,
                total: orderedEntries.length,
                pages: Math.max(Math.ceil(orderedEntries.length / parsedLimit), 1)
            }
        });
    } catch (error) {
        console.error('Get revenue entries error:', error);
        res.status(500).json({ message: 'Failed to fetch revenue entries' });
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

// Get all chat conversations (for sidebar) - organized by models
router.get('/chat-conversations', async (req, res) => {
    try {
        const { filterModelId, filterUserId } = req.query;

        // Get all unique chat conversations
        const whereClause = {};
        if (filterModelId) {
            whereClause.modelId = filterModelId;
        }
        if (filterUserId) {
            whereClause.userId = filterUserId;
        }

        const chats = await prisma.chat.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                },
                model: {
                    select: {
                        id: true,
                        name: true,
                        surname: true
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        content: true,
                        createdAt: true,
                        isFromUser: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Organize chats by model
        const modelsMap = new Map();

        chats.forEach(chat => {
            const modelId = chat.modelId;
            if (!modelsMap.has(modelId)) {
                modelsMap.set(modelId, {
                    id: chat.model.id,
                    name: chat.model.name,
                    surname: chat.model.surname,
                    users: []
                });
            }

            const model = modelsMap.get(modelId);
            const userChat = {
                userId: chat.userId,
                user: chat.user,
                lastMessage: chat.messages[0] || null,
                chatId: chat.id
            };

            // Check if user already exists for this model (shouldn't happen, but just in case)
            const existingUserIndex = model.users.findIndex(u => u.userId === chat.userId);
            if (existingUserIndex === -1) {
                model.users.push(userChat);
            }
        });

        // Convert map to array and sort
        const models = Array.from(modelsMap.values()).sort((a, b) => {
            const nameA = `${a.name} ${a.surname}`.toLowerCase();
            const nameB = `${b.name} ${b.surname}`.toLowerCase();
            return nameA.localeCompare(nameB);
        });

        res.json({ models, chats });

    } catch (error) {
        console.error('Get chat conversations error:', error);
        res.status(500).json({ message: 'Failed to fetch chat conversations' });
    }
});

// Get all users and managers for filter
router.get('/users-and-managers', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    in: ['USER', 'MANAGER']
                }
            },
            select: {
                id: true,
                email: true,
                role: true
            },
            orderBy: { email: 'asc' }
        });

        res.json({ users });

    } catch (error) {
        console.error('Get users and managers error:', error);
        res.status(500).json({ message: 'Failed to fetch users and managers' });
    }
});

// Get messages for a specific chat
router.get('/chat-messages', async (req, res) => {
    try {
        const { userId, modelId } = req.query;

        if (!userId || !modelId) {
            return res.status(400).json({ message: 'userId and modelId are required' });
        }

        const messages = await prisma.message.findMany({
            where: {
                userId,
                modelId
            },
            include: {
                user: {
                    select: { id: true, email: true }
                },
                model: {
                    select: { id: true, name: true, surname: true }
                },
                media: {
                    include: { unlocks: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        const formatted = formatMessages(messages, { viewingAsManager: true });

        res.json({ messages: formatted });

    } catch (error) {
        console.error('Get chat messages error:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});

module.exports = router;
