const determineUnlockStatus = (message, currentUserId, viewingAsManager = false) => {
    if (!message.media) return { isLocked: false, isUnlocked: true };

    const { media } = message;

    if (!media.isLocked) {
        return { isLocked: false, isUnlocked: true };
    }

    if (viewingAsManager) {
        return { isLocked: true, isUnlocked: true };
    }

    if (message.isFromUser) {
        // Messages sent by the user are always visible to them
        return { isLocked: true, isUnlocked: true };
    }

    const hasUnlock = media.unlocks?.some((unlock) => unlock.userId === currentUserId);
    return { isLocked: true, isUnlocked: !!hasUnlock };
};

const serializeMedia = (message, currentUserId, viewingAsManager = false) => {
    if (!message.media) return null;

    const media = message.media;
    const { isLocked, isUnlocked } = determineUnlockStatus(message, currentUserId, viewingAsManager);
    const effectiveLocked = isLocked && !isUnlocked;

    let parsedMetadata = media.metadata || null;
    if (typeof media.metadata === 'string') {
        try {
            parsedMetadata = JSON.parse(media.metadata);
        } catch (err) {
            parsedMetadata = media.metadata;
        }
    }

    return {
        id: media.id,
        url: media.url,
        type: media.type,
        bucket: media.bucket,
        objectName: media.objectName,
        size: media.size,
        metadata: parsedMetadata,
        isLocked: effectiveLocked,
        isUnlocked,
        lockPrice: media.lockPrice ?? 0
    };
};

const formatMessage = (message, options = {}) => {
    const { currentUserId = null, viewingAsManager = false } = options;

    return {
        id: message.id,
        chatId: message.chatId,
        userId: message.userId,
        modelId: message.modelId,
        content: message.content,
        isFromUser: message.isFromUser,
        createdAt: message.createdAt,
        user: message.user,
        model: message.model,
        senderUserId: message.senderUserId,
        receiverUserId: message.receiverUserId,
        media: serializeMedia(message, currentUserId, viewingAsManager)
    };
};

const formatMessages = (messages, options = {}) => {
    return messages.map((message) => formatMessage(message, options));
};

module.exports = {
    formatMessage,
    formatMessages
};

