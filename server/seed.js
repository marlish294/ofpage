const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    try {
        // Create admin user
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log('✅ Admin user already exists');
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 12);

            const admin = await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN',
                    isActive: true
                }
            });

            console.log('✅ Admin user created:', admin.email);
        }

        // Create sample manager and model for testing
        const sampleManagerEmail = 'manager@example.com';
        const existingManager = await prisma.user.findUnique({
            where: { email: sampleManagerEmail }
        });

        if (!existingManager) {
            const managerPassword = await bcrypt.hash('manager123', 12);

            const manager = await prisma.user.create({
                data: {
                    email: sampleManagerEmail,
                    password: managerPassword,
                    role: 'MANAGER',
                    isActive: true
                }
            });

            const managerRecord = await prisma.manager.create({
                data: {
                    userId: manager.id,
                    isApproved: true
                }
            });

            const model = await prisma.model.create({
                data: {
                    managerId: managerRecord.id,
                    name: 'Emma',
                    surname: 'Johnson',
                    bio: 'Professional model with 5+ years experience in fashion and commercial modeling.',
                    age: 25,
                    hairColor: 'Blonde',
                    skinColor: 'Fair',
                    photoUrl: 'https://via.placeholder.com/400x600/FFB6C1/FFFFFF?text=Emma+Johnson',
                    videoUrl: 'https://via.placeholder.com/400x300/FFB6C1/FFFFFF?text=Video+Preview'
                }
            });

            // Create sample plans
            await prisma.plan.createMany({
                data: [
                    {
                        modelId: model.id,
                        name: 'Basic Plan',
                        description: 'Access to basic photos and 1 chat message per day',
                        price: 9.99,
                        duration: 30
                    },
                    {
                        modelId: model.id,
                        name: 'Premium Plan',
                        description: 'Access to all photos, videos, and unlimited chat',
                        price: 19.99,
                        duration: 30
                    },
                    {
                        modelId: model.id,
                        name: 'VIP Plan',
                        description: 'Everything in Premium plus exclusive content and priority support',
                        price: 39.99,
                        duration: 30
                    }
                ]
            });

            console.log('✅ Sample manager and model created');
        }

        // Create sample user for testing
        const sampleUserEmail = 'user@example.com';
        const existingUser = await prisma.user.findUnique({
            where: { email: sampleUserEmail }
        });

        if (!existingUser) {
            const userPassword = await bcrypt.hash('user123', 12);

            const user = await prisma.user.create({
                data: {
                    email: sampleUserEmail,
                    password: userPassword,
                    role: 'USER',
                    isActive: true
                }
            });

            console.log('✅ Sample user created:', user.email);
        }

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Default accounts:');
        console.log(`Admin: ${adminEmail} / ${adminPassword}`);
        console.log('Manager: manager@example.com / manager123');
        console.log('User: user@example.com / user123');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
