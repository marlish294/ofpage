const express = require('express');
const multer = require('multer');
const prisma = require('../config/database');
const { authenticateToken, requireManager } = require('../middleware/auth');
const { uploadFile } = require('../config/minio');
const { formatMessages, formatMessage } = require('../utils/messageFormatter');
const { buildSubscriptionEntry, buildUnlockEntry } = require('../utils/revenue');
const { emitAdminEvent } = require('../utils/adminEvents');
const { getManagerEvents } = require('../utils/managerEvents');

const router = express.Router();

// All routes require manager authentication
router.use(authenticateToken);
router.use(requireManager);

router.get('/activity-events', (req, res) => {
    try {
        const events = getManagerEvents(req.user.id);
        res.json({ events });
    } catch (error) {
        console.error('Get manager activity events error:', error);
        res.status(500).json({ message: 'Failed to fetch activity events' });
    }
});

// Configure multer for file uploads
// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//         fileSize: 10 * 1024 * 1024 // 10MB limit
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only image and video files are allowed'), false);
//         }
//     }
// });



const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 200 * 1024 * 1024 // ✅ 200 MB limit
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
// router.post('/model', upload.fields([
//     { name: 'photo', maxCount: 1 },
//     { name: 'video', maxCount: 1 }
// ]), async (req, res) => {
//     try {
//         const {
//             name,
//             surname,
//             bio,
//             age,
//             hairColor,
//             skinColor
//         } = req.body;

//         // Validate required fields
//         if (!name || !surname || !bio || !age || !hairColor || !skinColor) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         const manager = await prisma.manager.findUnique({
//             where: { userId: req.user.id },
//             include: { model: true }
//         });

//         if (!manager) {
//             return res.status(404).json({ message: 'Manager not found' });
//         }

//         let photoUrl = null;
//         let videoUrl = null;

//         // Handle photo upload
//         // if (req.files && req.files.photo && req.files.photo[0]) {
//         //     const photoResult = await uploadFile(
//         //         req.files.photo[0].buffer,
//         //         req.files.photo[0].originalname,
//         //         req.files.photo[0].mimetype
//         //     );
//         //     if (photoResult.success) {
//         //         photoUrl = photoResult.url;
//         //     }
//         // }
//         // Handle photo upload
//         if (req.files && req.files.photo && req.files.photo[0]) {
//             console.log('📸 Uploading photo:', req.files.photo[0].originalname);
//             const photoResult = await uploadFile(
//                 req.files.photo[0].buffer,
//                 req.files.photo[0].originalname,
//                 req.files.photo[0].mimetype
//             );
//             console.log('📸 Photo upload result:', photoResult);

//             if (photoResult.success) {
//                 photoUrl = photoResult.url;
//             } else {
//                 console.error('❌ Photo upload failed:', photoResult.error);
//             }
//         }

//         // Handle video upload
//         if (req.files && req.files.video && req.files.video[0]) {
//             const videoResult = await uploadFile(
//                 req.files.video[0].buffer,
//                 req.files.video[0].originalname,
//                 req.files.video[0].mimetype
//             );
//             if (videoResult.success) {
//                 videoUrl = videoResult.url;
//             }
//         }

//         // Create or update model
//         let model;
//         if (manager.model) {
//             // Update existing model
//             model = await prisma.model.update({
//                 where: { id: manager.model.id },
//                 data: {
//                     name,
//                     surname,
//                     bio,
//                     age: parseInt(age),
//                     hairColor,
//                     skinColor,
//                     photoUrl: photoUrl || manager.model.photoUrl,
//                     videoUrl: videoUrl || manager.model.videoUrl
//                 },
//                 include: {
//                     plans: {
//                         where: { isActive: true },
//                         orderBy: { createdAt: 'asc' }
//                     }
//                 }
//             });
//         } else {
//             // Create new model
//             model = await prisma.model.create({
//                 data: {
//                     managerId: manager.id,
//                     name,
//                     surname,
//                     bio,
//                     age: parseInt(age),
//                     hairColor,
//                     skinColor,
//                     photoUrl,
//                     videoUrl
//                 },
//                 include: {
//                     plans: {
//                         where: { isActive: true },
//                         orderBy: { createdAt: 'asc' }
//                     }
//                 }
//             });
//         }

//         res.json({
//             message: 'Model saved successfully',
//             model
//         });

//     } catch (error) {
//         console.error('Save model error:', error);
//         res.status(500).json({ message: 'Failed to save model' });
//     }
// });




// router.post('/model', upload.fields([
//     { name: 'photo', maxCount: 1 },
//     { name: 'video', maxCount: 1 }
// ]), async (req, res) => {
//     try {
//         // 🧩 Step 1 — Log everything incoming
//         console.log('🔥 Incoming form data:', req.body);
//         console.log('📂 Incoming files:', req.files);

//         const {
//             name,
//             surname,
//             bio,
//             age,
//             hairColor,
//             skinColor
//         } = req.body;

//         // ✅ Validate required fields
//         if (!name || !surname || !bio || !age || !hairColor || !skinColor) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         const manager = await prisma.manager.findUnique({
//             where: { userId: req.user.id },
//             include: { model: true }
//         });

//         if (!manager) {
//             return res.status(404).json({ message: 'Manager not found' });
//         }

//         let photoUrl = null;
//         let videoUrl = null;

//         // 📸 Handle photo upload
//         if (req.files && req.files.photo && req.files.photo[0]) {
//             console.log('📸 Uploading photo:', req.files.photo[0].originalname);
//             const photoResult = await uploadFile(
//                 req.files.photo[0].buffer,
//                 req.files.photo[0].originalname,
//                 req.files.photo[0].mimetype
//             );
//             console.log('📸 Photo upload result:', photoResult);

//             if (photoResult.success) {
//                 photoUrl = photoResult.url;
//             } else {
//                 console.error('❌ Photo upload failed:', photoResult.error);
//             }
//         }

//         // 🎥 Handle video upload
//         if (req.files && req.files.video && req.files.video[0]) {
//             console.log('🎥 Uploading video:', req.files.video[0].originalname);
//             const videoResult = await uploadFile(
//                 req.files.video[0].buffer,
//                 req.files.video[0].originalname,
//                 req.files.video[0].mimetype
//             );
//             console.log('🎥 Video upload result:', videoResult);

//             if (videoResult.success) {
//                 videoUrl = videoResult.url;
//             } else {
//                 console.error('❌ Video upload failed:', videoResult.error);
//             }
//         }

//         // 🧠 Log before saving to DB
//         console.log('✅ Ready to save model with photoUrl:', photoUrl, 'and videoUrl:', videoUrl);

//         // 💾 Create or update model
//         let model;
//         if (manager.model) {
//             model = await prisma.model.update({
//                 where: { id: manager.model.id },
//                 data: {
//                     name,
//                     surname,
//                     bio,
//                     age: parseInt(age),
//                     hairColor,
//                     skinColor,
//                     photoUrl: photoUrl || manager.model.photoUrl,
//                     videoUrl: videoUrl || manager.model.videoUrl
//                 },
//                 include: {
//                     plans: {
//                         where: { isActive: true },
//                         orderBy: { createdAt: 'asc' }
//                     }
//                 }
//             });
//         } else {
//             model = await prisma.model.create({
//                 data: {
//                     managerId: manager.id,
//                     name,
//                     surname,
//                     bio,
//                     age: parseInt(age),
//                     hairColor,
//                     skinColor,
//                     photoUrl,
//                     videoUrl
//                 },
//                 include: {
//                     plans: {
//                         where: { isActive: true },
//                         orderBy: { createdAt: 'asc' }
//                     }
//                 }
//             });
//         }

//         // ✅ Success response
//         res.json({
//             message: 'Model saved successfully',
//             model
//         });

//     } catch (error) {
//         console.error('💥 Save model error (full):', error);
//         res.status(500).json({ message: 'Failed to save model', error: error.message });
//     }
// });


router.post('/model', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log('🔥 Incoming form data:', req.body);
        console.log('📂 Incoming files:', req.files);

        const { name, surname, bio, age, hairColor, skinColor } = req.body;

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

        // 📸 Handle photo
        if (req.files?.photo?.[0]) {
            console.log('📸 Uploading photo:', req.files.photo[0].originalname);
            const result = await uploadFile(
                req.files.photo[0].buffer,
                req.files.photo[0].originalname,
                req.files.photo[0].mimetype
            );
            if (result.success) photoUrl = result.url;
            console.log('✅ Photo uploaded:', photoUrl);
        }

        // 🎥 Handle video
        if (req.files?.video?.[0]) {
            console.log('🎥 Uploading video:', req.files.video[0].originalname);
            const result = await uploadFile(
                req.files.video[0].buffer,
                req.files.video[0].originalname,
                req.files.video[0].mimetype
            );
            if (result.success) videoUrl = result.url;
            console.log('✅ Video uploaded:', videoUrl);
        }

        console.log('✅ Ready to save model with photoUrl:', photoUrl, 'and videoUrl:', videoUrl);

        let model;

        // 🧩 Use safe fallback logic - preserve existing URLs when only one file is uploaded
        if (manager.model && manager.model.id) {
            console.log('🧩 Updating existing model ID:', manager.model.id);

            const updateData = {
                name,
                surname,
                bio,
                age: parseInt(age),
                hairColor,
                skinColor
            };

            // Only update photoUrl if a new photo was uploaded
            if (photoUrl) {
                updateData.photoUrl = photoUrl;
            } else {
                // Preserve existing photoUrl
                updateData.photoUrl = manager.model.photoUrl;
            }

            // Only update videoUrl if a new video was uploaded
            if (videoUrl) {
                updateData.videoUrl = videoUrl;
            } else {
                // Preserve existing videoUrl
                updateData.videoUrl = manager.model.videoUrl;
            }

            model = await prisma.model.update({
                where: { id: manager.model.id },
                data: updateData,
                include: {
                    plans: {
                        where: { isActive: true },
                        orderBy: { createdAt: 'asc' }
                    }
                }
            });

            console.log('✅ Model updated successfully:', model.id, 'videoUrl:', model.videoUrl);
        } else {
            console.log('🆕 Creating new model for manager ID:', manager.id);

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

            console.log('✅ New model created successfully:', model.id);
        }

        // Ensure model response includes all fields
        console.log('📤 Sending response with model:', {
            id: model.id,
            photoUrl: model.photoUrl,
            videoUrl: model.videoUrl
        });

        return res.status(200).json({
            message: 'Model saved successfully',
            model: {
                ...model,
                photoUrl: model.photoUrl || null,
                videoUrl: model.videoUrl || null
            }
        });

    } catch (error) {
        console.error('💥 Save model error (full):', error);

        if (error.code) console.error('⚙️ Prisma error code:', error.code);
        if (error.meta) console.error('📦 Prisma error meta:', error.meta);
        if (error.message) console.error('🧾 Error message:', error.message);

        res.status(500).json({
            message: 'Failed to save model',
            error: error.message || 'Unknown error'
        });
    }
});






// Create plan
router.post('/plans', upload.array('files', 50), async (req, res) => {
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

        // If files were uploaded, store them as media
        const createdMedia = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadFile(file.buffer, file.originalname, file.mimetype);
                if (result.success) {
                    const type = file.mimetype.startsWith('image/') ? 'IMAGE' : (file.mimetype.startsWith('video/') ? 'VIDEO' : 'OTHER');
                    const media = await prisma.media.create({
                        data: {
                            planId: plan.id,
                            type,
                            url: result.url
                        }
                    });
                    createdMedia.push(media);
                }
            }
        }

        res.status(201).json({
            message: 'Plan created successfully',
            plan,
            media: createdMedia
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
        const { name, description, price, duration, isActive } = req.body;

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

        const data = {
            name: name ?? plan.name,
            description: description ?? plan.description,
            price: price !== undefined ? parseFloat(price) : plan.price,
            duration: duration !== undefined ? parseInt(duration) : plan.duration
        };

        if (isActive !== undefined) {
            const parsedActive = (isActive === true || isActive === 'true');
            data.isActive = parsedActive;
        }

        const updatedPlan = await prisma.plan.update({
            where: { id: id },
            data
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

// Upload media files to a plan (images/videos)
router.post('/plans/:id/media', upload.array('files', 50), async (req, res) => {
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
            where: { id, modelId: manager.model.id, isActive: true }
        });

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const createdMedia = [];
        for (const file of req.files) {
            const result = await uploadFile(file.buffer, file.originalname, file.mimetype);
            if (result.success) {
                const type = file.mimetype.startsWith('image/') ? 'IMAGE' : (file.mimetype.startsWith('video/') ? 'VIDEO' : 'OTHER');
                const media = await prisma.media.create({
                    data: {
                        planId: plan.id,
                        type,
                        url: result.url
                    }
                });
                createdMedia.push(media);
            }
        }

        res.status(201).json({ message: 'Media uploaded', media: createdMedia });
    } catch (error) {
        console.error('Upload media error:', error);
        res.status(500).json({ message: 'Failed to upload media' });
    }
});

// List media for a plan (manager-owned)
router.get('/plans/:id/media', async (req, res) => {
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
            where: { id, modelId: manager.model.id, isActive: true }
        });

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        const media = await prisma.media.findMany({
            where: { planId: plan.id, isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ media });
    } catch (error) {
        console.error('List media error:', error);
        res.status(500).json({ message: 'Failed to fetch media' });
    }
});

// Soft-delete a media item
router.delete('/media/:mediaId', async (req, res) => {
    try {
        const { mediaId } = req.params;

        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        const media = await prisma.media.findUnique({ where: { id: mediaId } });
        if (!media) return res.status(404).json({ message: 'Media not found' });

        const plan = await prisma.plan.findFirst({
            where: { id: media.planId, modelId: manager.model.id }
        });
        if (!plan) return res.status(403).json({ message: 'Not authorized for this media' });

        await prisma.media.update({
            where: { id: mediaId },
            data: { isActive: false }
        });

        res.json({ message: 'Media deleted' });
    } catch (error) {
        console.error('Delete media error:', error);
        res.status(500).json({ message: 'Failed to delete media' });
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

        // Get total revenue based on immutable amountPaid
        const subscriptions = await prisma.subscription.findMany({
            where: {
                modelId: manager.model.id,
                isActive: true
            },
            select: { amountPaid: true }
        });

        const subscriptionRevenue = subscriptions.reduce((sum, sub) => sum + (sub.amountPaid || 0), 0);

        const mediaUnlocks = await prisma.messageMediaUnlock.findMany({
            where: {
                media: {
                    message: {
                        modelId: manager.model.id
                    }
                }
            },
            select: { amountPaid: true }
        });

        const mediaUnlockRevenue = mediaUnlocks.reduce((sum, unlock) => sum + (unlock.amountPaid || 0), 0);
        const totalRevenue = subscriptionRevenue + mediaUnlockRevenue;

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
                recentSubscriptions,
                subscriptionRevenue,
                mediaUnlockRevenue,
                mediaUnlockCount: mediaUnlocks.length
            }
        });

    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
});

router.get('/revenue/summary', async (req, res) => {
    try {
        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        const modelId = manager.model.id;
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
            latestUnlock,
            subscriberRecords
        ] = await Promise.all([
            prisma.subscription.findMany({
                where: {
                    modelId,
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
                    media: {
                        message: {
                            modelId
                        }
                    },
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
                where: { modelId },
                orderBy: { createdAt: 'asc' },
                select: { createdAt: true }
            }),
            prisma.messageMediaUnlock.findFirst({
                where: {
                    media: {
                        message: {
                            modelId
                        }
                    }
                },
                orderBy: { createdAt: 'asc' },
                select: { createdAt: true }
            }),
            prisma.subscription.findFirst({
                where: { modelId },
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true }
            }),
            prisma.messageMediaUnlock.findFirst({
                where: {
                    media: {
                        message: {
                            modelId
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true }
            }),
            prisma.subscription.findMany({
                where: {
                    modelId,
                    isActive: true
                },
                distinct: ['userId'],
                select: { userId: true }
            })
        ]);

        const subscriberCount = subscriberRecords.length;

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
            availableYears,
            subscriberCount
        });
    } catch (error) {
        console.error('Get manager revenue summary error:', error);
        res.status(500).json({ message: 'Failed to fetch revenue summary' });
    }
});

router.get('/revenue/entries', async (req, res) => {
    try {
        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        const modelId = manager.model.id;
        const {
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

        const subscriptionWhere = { modelId };
        const unlockWhere = {
            media: {
                message: {
                    modelId
                }
            }
        };

        if (Object.keys(dateFilter).length > 0) {
            subscriptionWhere.createdAt = dateFilter;
            unlockWhere.createdAt = dateFilter;
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
        console.error('Get manager revenue entries error:', error);
        res.status(500).json({ message: 'Failed to fetch revenue entries' });
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

        const subscriptions = await prisma.subscription.findMany({
            where: {
                modelId: manager.model.id,
                isActive: true
            },
            distinct: ['userId'],
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

        // Get all blocked users by this manager
        const blockedUsers = await prisma.blockedUser.findMany({
            where: {
                blockedById: req.user.id
            },
            select: {
                blockedUserId: true
            }
        });

        const blockedUserIds = new Set(blockedUsers.map(bu => bu.blockedUserId));

        // Add block status to each subscriber
        const subscribers = subscriptions.map(sub => ({
            ...sub,
            isBlocked: blockedUserIds.has(sub.userId)
        }));

        res.json({ subscribers });

    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({ message: 'Failed to fetch subscribers' });
    }
});

// Block a subscriber
router.post('/subscribers/:userId/block', async (req, res) => {
    try {
        const { userId } = req.params;
        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        // Verify the user is actually a subscriber
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: userId,
                modelId: manager.model.id,
                isActive: true
            }
        });

        if (!subscription) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }

        // Check if already blocked
        const existingBlock = await prisma.blockedUser.findUnique({
            where: {
                blockedById_blockedUserId: {
                    blockedById: req.user.id,
                    blockedUserId: userId
                }
            }
        });

        if (existingBlock) {
            return res.status(400).json({ message: 'User is already blocked' });
        }

        // Block the user
        await prisma.blockedUser.create({
            data: {
                blockedById: req.user.id,
                blockedUserId: userId
            }
        });

        res.json({ message: 'User blocked successfully' });

    } catch (error) {
        console.error('Block subscriber error:', error);
        res.status(500).json({ message: 'Failed to block subscriber' });
    }
});

// Unblock a subscriber
router.post('/subscribers/:userId/unblock', async (req, res) => {
    try {
        const { userId } = req.params;
        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        // Check if user is blocked
        const blockRecord = await prisma.blockedUser.findUnique({
            where: {
                blockedById_blockedUserId: {
                    blockedById: req.user.id,
                    blockedUserId: userId
                }
            }
        });

        if (!blockRecord) {
            return res.status(404).json({ message: 'User is not blocked' });
        }

        // Unblock the user
        await prisma.blockedUser.delete({
            where: {
                id: blockRecord.id
            }
        });

        res.json({ message: 'User unblocked successfully' });

    } catch (error) {
        console.error('Unblock subscriber error:', error);
        res.status(500).json({ message: 'Failed to unblock subscriber' });
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
                },
                media: {
                    include: { unlocks: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset)
        });

        res.json({
            messages: formatMessages(messages.reverse(), {
                currentUserId: req.user.id,
                viewingAsManager: true
            }),
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
router.post('/messages', upload.single('media'), async (req, res) => {
    try {
        const { userId } = req.body;
        let { content } = req.body;
        const mediaFile = req.file;

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        if ((!content || !content.trim()) && !mediaFile) {
            return res.status(400).json({ message: 'Message content or media is required' });
        }

        content = content && content.trim().length > 0 ? content.trim() : null;

        const manager = await prisma.manager.findUnique({
            where: { userId: req.user.id },
            include: { model: true }
        });

        if (!manager || !manager.model) {
            return res.status(404).json({ message: 'Model not found' });
        }

        const subscriberUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true }
        });

        if (!subscriberUser) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }

        const modelId = manager.model.id;

        // Ensure chat exists
        let chat = await prisma.chat.findFirst({
            where: {
                userId,
                modelId
            }
        });
        let chatCreated = false;
        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    userId,
                    modelId
                }
            });
            chatCreated = true;
        }

        // Create message
        const isLocked = req.body.isLocked === 'true' || req.body.isLocked === true;
        const lockPriceValue = req.body.lockPrice !== undefined ? parseFloat(req.body.lockPrice) : 0;

        if (isLocked && (!lockPriceValue || Number.isNaN(lockPriceValue) || lockPriceValue <= 0)) {
            return res.status(400).json({ message: 'A valid lock price is required when locking media' });
        }

        let uploadResult = null;
        let uploadTimestamp = null;
        if (mediaFile) {
            uploadTimestamp = new Date().toISOString();
            uploadResult = await uploadFile(mediaFile.buffer, mediaFile.originalname, mediaFile.mimetype, {
                folder: 'chats-photos-videos',
                metaData: {
                    'x-amz-meta-sender-id': req.user.id,
                    'x-amz-meta-receiver-id': userId,
                    'x-amz-meta-chat-id': chat.id,
                    'x-amz-meta-timestamp': uploadTimestamp,
                    'x-amz-meta-file-type': mediaFile.mimetype
                }
            });

            if (!uploadResult.success) {
                return res.status(500).json({ message: 'Failed to upload media', error: uploadResult.error });
            }
        }

        const serializedMetadata = mediaFile ? JSON.stringify({
            originalName: mediaFile.originalname,
            mimeType: mediaFile.mimetype,
            senderUserId: req.user.id,
            receiverUserId: userId,
            chatId: chat.id,
            uploadedAt: uploadTimestamp,
            fileType: mediaFile.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE',
            fileUrl: uploadResult?.url
        }) : null;

        const message = await prisma.message.create({
            data: {
                userId,
                modelId,
                chatId: chat.id,
                content,
                isFromUser: false,
                senderUserId: req.user.id,
                receiverUserId: userId,
                media: mediaFile ? {
                    create: {
                        bucket: uploadResult.bucket,
                        objectName: uploadResult.objectName,
                        url: uploadResult.url,
                        type: mediaFile.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE',
                        size: mediaFile.size,
                        metadata: serializedMetadata,
                        isLocked,
                        lockPrice: isLocked ? lockPriceValue : 0
                    }
                } : undefined
            },
            include: {
                user: { select: { id: true, email: true } },
                model: { select: { id: true, name: true, surname: true } },
                media: {
                    include: { unlocks: true }
                }
            }
        });

        const io = req.app.get('io');
        const formattedMessage = formatMessage(message, {
            currentUserId: req.user.id,
            viewingAsManager: true
        });

        if (io) io.to(`chat_${chat.id}`).emit('new_message', formattedMessage);

        if (chatCreated) {
            emitAdminEvent({
                type: 'chat.started',
                title: 'New chat started',
                description: `${req.user.email} started a chat with ${subscriberUser.email} for ${manager.model.name}.`,
                icon: 'fas fa-comments',
                color: '#00aff0',
                data: {
                    chatId: chat.id,
                    managerUserId: req.user.id,
                    managerEmail: req.user.email,
                    userId: subscriberUser.id,
                    userEmail: subscriberUser.email,
                    modelId,
                    modelName: manager.model.name
                },
                timestamp: Date.now()
            });
        }

        if (mediaFile) {
            const mediaType = mediaFile.mimetype.startsWith('video/') ? 'video' : 'photo';
            emitAdminEvent({
                type: 'chat.media_uploaded',
                title: 'Chat media uploaded',
                description: `${req.user.email} sent a ${mediaType}${isLocked ? ' (locked)' : ''} to ${subscriberUser.email}.`,
                icon: mediaType === 'video' ? 'fas fa-video' : 'fas fa-image',
                color: '#6f42c1',
                data: {
                    chatId: chat.id,
                    messageId: message.id,
                    managerUserId: req.user.id,
                    managerEmail: req.user.email,
                    userId: subscriberUser.id,
                    userEmail: subscriberUser.email,
                    modelId,
                    modelName: manager.model.name,
                    mediaType,
                    locked: isLocked,
                    lockPrice: isLocked ? lockPriceValue : 0
                },
                timestamp: Date.now()
            });
        }

        res.json({ message: formattedMessage });

    } catch (error) {
        console.error('💥 Send message error (full):', error);

        if (error.code) console.error('⚙️ Prisma error code:', error.code);
        if (error.meta) console.error('📦 Prisma error meta:', error.meta);
        if (error.message) console.error('🧾 Error message:', error.message);

        res.status(500).json({
            message: 'Failed to send message',
            error: error.message || 'Unknown error'
        });
    };
});



module.exports = router;
