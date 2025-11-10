const { getIO } = require('../config/socketio');

const formatModelName = (model) => {
    if (!model) {
        return 'Unknown Model';
    }

    const parts = [model.name, model.surname].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Unknown Model';
};

const buildSubscriptionEntry = (subscription) => {
    if (!subscription) {
        return null;
    }

    return {
        id: subscription.id,
        type: 'subscription',
        date: subscription.createdAt,
        amount: subscription.amountPaid || 0,
        modelId: subscription.modelId,
        modelName: formatModelName(subscription.model),
        userId: subscription.userId,
        userName: subscription.user?.email || 'Unknown User',
        planName: subscription.plan?.name || null
    };
};

const buildUnlockEntry = (unlock) => {
    if (!unlock) {
        return null;
    }

    const relatedModel = unlock.media?.message?.model;
    const modelId = relatedModel?.id || unlock.media?.message?.modelId || null;

    return {
        id: unlock.id,
        type: 'unlock',
        date: unlock.createdAt,
        amount: unlock.amountPaid || 0,
        modelId,
        modelName: formatModelName(relatedModel),
        userId: unlock.userId,
        userName: unlock.user?.email || 'Unknown User',
        mediaId: unlock.mediaId
    };
};

const emitRevenueUpdate = (entry) => {
    if (typeof getIO !== 'function' || !entry) {
        return;
    }

    const io = getIO();
    if (!io) {
        return;
    }

    io.emit('revenue_update', { entry });
};

module.exports = {
    buildSubscriptionEntry,
    buildUnlockEntry,
    emitRevenueUpdate
};

