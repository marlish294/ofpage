const { getIO } = require('../config/socketio');

const MANAGER_EVENT_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_MANAGER_EVENTS = 200;

const eventsByManager = new Map();

const pruneEvents = (managerUserId) => {
    const key = String(managerUserId);
    if (!eventsByManager.has(key)) return;

    const cutoff = Date.now() - MANAGER_EVENT_TTL_MS;
    const events = eventsByManager.get(key).filter(event => event.timestamp >= cutoff);

    if (events.length > MAX_MANAGER_EVENTS) {
        events.splice(0, events.length - MAX_MANAGER_EVENTS);
    }

    eventsByManager.set(key, events);
};

const emitManagerEvent = (managerUserId, event = {}) => {
    if (!managerUserId) return;

    const key = String(managerUserId);
    const io = typeof getIO === 'function' ? getIO() : null;

    const payload = {
        id: event.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: event.type || 'general',
        title: event.title || 'Activity',
        description: event.description || '',
        icon: event.icon || 'fas fa-info-circle',
        color: event.color || '#00aff0',
        data: event.data || {},
        timestamp: event.timestamp || Date.now()
    };

    pruneEvents(managerUserId);

    const existing = eventsByManager.get(key) || [];
    existing.push(payload);
    eventsByManager.set(key, existing);

    if (io) {
        io.to(`manager_${managerUserId}`).emit('manager_event', payload);
    }
};

const getManagerEvents = (managerUserId) => {
    if (!managerUserId) return [];
    pruneEvents(managerUserId);
    const key = String(managerUserId);
    const events = eventsByManager.get(key) || [];
    return [...events].sort((a, b) => b.timestamp - a.timestamp);
};

module.exports = {
    emitManagerEvent,
    getManagerEvents
};
