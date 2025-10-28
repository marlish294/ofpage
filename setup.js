#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Social Platform...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
    console.error('❌ Please run this script from the project root directory');
    process.exit(1);
}

try {
    // Install backend dependencies
    console.log('📦 Installing backend dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Install frontend dependencies
    console.log('📦 Installing frontend dependencies...');
    execSync('cd client && npm install', { stdio: 'inherit' });

    // Generate Prisma client
    console.log('🗄️  Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Run database migrations
    console.log('🗄️  Running database migrations...');
    execSync('npx prisma db push', { stdio: 'inherit' });

    // Seed the database
    console.log('🌱 Seeding database...');
    execSync('npm run seed', { stdio: 'inherit' });

    console.log('\n✅ Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the backend server: npm run server');
    console.log('2. Start the frontend (in a new terminal): npm run client');
    console.log('3. Open http://localhost:8080 in your browser');
    console.log('\n🔑 Demo accounts:');
    console.log('Admin: admin@gmail.com / admin123');
    console.log('Manager: manager@example.com / manager123');
    console.log('User: user@example.com / user123');

} catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
}
