// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

// async function main() {
//   await prisma.user.create({
//     data: {
//       email: 'admin@gmail.com',
//       password: 'admin123',
//       role: 'ADMIN'
//     }
//   })
//   console.log('✅ Admin user created: admin@gmail.com / admin123')
// }

// main()
//   .catch(e => console.error(e))
//   .finally(async () => await prisma.$disconnect())
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
  const hashedAdminPass = await bcrypt.hash('admin123', 12)
  const hashedManagerPass = await bcrypt.hash('manager123', 12)
  const hashedUserPass = await bcrypt.hash('user123', 12)

  await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: hashedAdminPass,
      role: 'ADMIN'
    }
  })

  await prisma.user.create({
    data: {
      email: 'manager@example.com',
      password: hashedManagerPass,
      role: 'MANAGER'
    }
  })

  await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedUserPass,
      role: 'USER'
    }
  })

  console.log('✅ Admin, Manager, and User seeded with hashed passwords')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

