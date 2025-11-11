const { getIO } = require('../config/socketio');

const ADMIN_EVENT_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_EVENTS = 200;

let events = [];

const pruneEvents = () => {
    const cutoff = Date.now() - ADMIN_EVENT_TTL_MS;
    events = events.filter(event => event.timestamp >= cutoff);
    if (events.length > MAX_EVENTS) {
        events = events.slice(events.length - MAX_EVENTS);
    }
};

const emitAdminEvent = (event = {}) => {
    const io = typeof getIO === 'function' ? getIO() : null;

    const payload = {
        id: event.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: event.type || 'general',
        title: event.title || 'Admin Event',
        description: event.description || '',
        icon: event.icon || 'fas fa-info-circle',
        color: event.color || '#00aff0',
        data: event.data || {},
        timestamp: event.timestamp || Date.now()
    };

    pruneEvents();
    events.push(payload);
    if (io) {
        io.emit('admin_event', payload);
    }
};

const getAdminEvents = () => {
    pruneEvents();
    return [...events].sort((a, b) => b.timestamp - a.timestamp);
};

module.exports = {
    emitAdminEvent,
    getAdminEvents
};
