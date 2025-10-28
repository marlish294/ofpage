# Social Platform

A comprehensive social platform with model subscriptions, real-time chat, and role-based access control.

## 🌟 Features

### Public Features
- **Model Discovery**: Browse and view model profiles
- **Subscription System**: Subscribe to models with demo payment processing
- **Authentication**: User registration and login system

### User Features
- **Personal Dashboard**: View subscriptions and manage account
- **Real-time Chat**: Chat with subscribed models using WebSockets
- **Multi-subscription**: Subscribe to multiple models simultaneously

### Manager Features
- **Model Management**: Create and manage model profiles
- **Plan Management**: Create up to 4 subscription plans
- **Chat Management**: Respond to subscriber messages as the model
- **Analytics Dashboard**: Track subscribers and revenue

### Admin Features
- **Platform Overview**: Monitor total revenue and user statistics
- **Manager Approval**: Approve or reject manager applications
- **User Management**: Block/unblock users and models
- **Chat Monitoring**: View all conversations (read-only)

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vue.js 3, Bootstrap 5
- **Database**: SQLite with Prisma ORM
- **File Storage**: MinIO
- **Real-time**: Socket.IO
- **Authentication**: JWT

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and setup**:
   ```bash
   cd /Users/admin/Desktop/newnew
   node setup.js
   ```

2. **Start the application**:
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

3. **Access the application**:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000/api

## 🔑 Demo Accounts

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | admin@gmail.com | admin123 | Full platform access |
| Manager | manager@example.com | manager123 | Model management |
| User | user@example.com | user123 | Subscriber access |

## 📁 Project Structure

```
social-platform/
├── server/                 # Backend API
│   ├── config/            # Database, MinIO, Socket.IO config
│   ├── middleware/        # Authentication middleware
│   ├── routes/           # API routes (auth, social, user, manager, admin)
│   └── index.js          # Main server file
├── client/               # Vue.js frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── views/        # Page components
│   │   ├── router/       # Vue Router configuration
│   │   ├── store/        # Vuex store
│   │   └── services/     # API service
│   └── public/           # Static assets
├── prisma/               # Database schema
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables
The `.env` file is automatically created with the following configuration:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# MinIO Configuration
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_REGION=eu
MINIO_BUCKET=test-of
MINIO_ENDPOINT=http://104.168.10.93:9000
MINIO_URL=http://104.168.10.93:9000
MINIO_USE_PATH_STYLE_ENDPOINT=true

# Server
PORT=3000
NODE_ENV=development

# Admin Default Credentials
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123
```

## 📱 Usage Guide

### For Users
1. **Register/Login**: Create an account or use demo credentials
2. **Browse Models**: View available models on the homepage
3. **Subscribe**: Click on a model to view details and subscribe
4. **Chat**: Access your dashboard to chat with subscribed models

### For Managers
1. **Login**: Use manager credentials
2. **Create Model**: Set up your model profile with photos and details
3. **Create Plans**: Add up to 4 subscription plans
4. **Manage Chats**: Respond to subscriber messages

### For Admins
1. **Login**: Use admin credentials
2. **Approve Managers**: Review and approve manager applications
3. **Monitor Platform**: View overall statistics and user activity
4. **Manage Users**: Block/unblock users and models as needed

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Social (Public)
- `GET /api/social/models` - Get all models
- `GET /api/social/models/:id` - Get model details
- `POST /api/social/subscribe` - Demo subscription

### User
- `GET /api/user/subscriptions` - Get user subscriptions
- `POST /api/user/subscribe` - Subscribe to model
- `DELETE /api/user/subscriptions/:id` - Cancel subscription
- `GET /api/user/chat-models` - Get chat models
- `GET /api/user/chats/:modelId` - Get chat history

### Manager
- `GET /api/manager/model` - Get manager's model
- `POST /api/manager/model` - Create/update model
- `GET /api/manager/dashboard` - Get dashboard stats
- `GET /api/manager/chats` - Get subscribers
- `POST /api/manager/plans` - Create plan
- `PUT /api/manager/plans/:id` - Update plan
- `DELETE /api/manager/plans/:id` - Delete plan

### Admin
- `GET /api/admin/dashboard` - Get platform stats
- `GET /api/admin/pending-managers` - Get pending managers
- `POST /api/admin/approve-manager/:id` - Approve manager
- `DELETE /api/admin/reject-manager/:id` - Reject manager
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/:id/block` - Block/unblock user
- `GET /api/admin/models` - Get all models
- `POST /api/admin/models/:id/block` - Block/unblock model
- `GET /api/admin/chats` - Get all chats

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   
   # Kill process on port 8080
   lsof -ti:8080 | xargs kill -9
   ```

2. **Database issues**:
   ```bash
   # Reset database
   rm dev.db
   npx prisma db push
   npm run seed
   ```

3. **MinIO connection issues**:
   - Check if MinIO server is running
   - Verify network connectivity to MinIO endpoint
   - Check MinIO credentials in `.env`

### Development

- **Backend logs**: Check terminal running `npm run server`
- **Frontend logs**: Check browser console and terminal running `npm run client`
- **Database**: Use Prisma Studio with `npx prisma studio`

## 📄 License

MIT License - feel free to use this project for learning and development purposes.

## 🤝 Contributing

This is a demo project. For production use, consider:
- Implementing proper file upload handling
- Adding real payment processing
- Enhancing security measures
- Adding comprehensive testing
- Implementing proper error handling and logging
