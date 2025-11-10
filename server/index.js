const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const managerRoutes = require('./routes/manager');
const adminRoutes = require('./routes/admin');
const socialRoutes = require('./routes/social');
const { initializeMinIO } = require('./config/minio');
const { initializeSocketIO } = require('./config/socketio');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:8080', 'http://localhost:3000'],
        methods: ['GET', 'POST']
    }
});

// Initialize MinIO
initializeMinIO();

// Initialize Socket.IO
initializeSocketIO(io);
app.set('io', io);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/user', userRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend should be running on http://localhost:8080`);
    console.log(`🔗 API available at http://localhost:${PORT}/api`);
});

module.exports = { app, io };
