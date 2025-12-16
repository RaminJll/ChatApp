import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  await prisma.message.deleteMany()
  await prisma.groupMember.deleteMany()
  await prisma.group.deleteMany()
  await prisma.directMessage.deleteMany()
  await prisma.friendship.deleteMany()
  await prisma.user.deleteMany()

  // USERS
  const password = await bcrypt.hash('password123.', 10)

  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `user${i + 1}@example.com`,
          username: `user${i + 1}`,
          password,
        },
      })
    )
  )

  // FRIENDSHIPS
  await prisma.friendship.createMany({
    data: [
      {
        senderId: users[0].id,
        receiverId: users[1].id,
        status: 'ACCEPTED',
      },
      {
        senderId: users[0].id,
        receiverId: users[2].id,
        status: 'PENDING',
      },
      {
        senderId: users[3].id,
        receiverId: users[4].id,
        status: 'ACCEPTED',
      },
    ],
  })

  // DIRECT MESSAGES
  const dm1 = await prisma.directMessage.create({
    data: {
      user1Id: users[0].id,
      user2Id: users[1].id,
    },
  })

  const dm2 = await prisma.directMessage.create({
    data: {
      user1Id: users[2].id,
      user2Id: users[3].id,
    },
  })

  // DM MESSAGES
  await prisma.message.createMany({
    data: [
      {
        content: 'Salut, ça va ?',
        authorId: users[0].id,
        directMessageId: dm1.id,
      },
      {
        content: 'Oui et toi ?',
        authorId: users[1].id,
        directMessageId: dm1.id,
      },
      {
        content: 'Hello en DM',
        authorId: users[2].id,
        directMessageId: dm2.id,
      },
    ],
  })

  // GROUPES
  const group1 = await prisma.group.create({
    data: {
      name: 'Groupe Dev',
      creatorId: users[0].id,
    },
  })

  const group2 = await prisma.group.create({
    data: {
      name: 'Groupe Gaming',
      creatorId: users[3].id,
    },
  })

  // GROUP MEMBERS
  await prisma.groupMember.createMany({
    data: [
      { userId: users[0].id, groupId: group1.id, role: 'ADMIN' },
      { userId: users[1].id, groupId: group1.id },
      { userId: users[2].id, groupId: group1.id },

      { userId: users[3].id, groupId: group2.id, role: 'ADMIN' },
      { userId: users[4].id, groupId: group2.id },
      { userId: users[5].id, groupId: group2.id },
    ],
  })

  // GROUP MESSAGES
  await prisma.message.createMany({
    data: [
      {
        content: 'Bienvenue dans le groupe Dev',
        authorId: users[0].id,
        groupId: group1.id,
      },
      {
        content: 'Salut tout le monde',
        authorId: users[1].id,
        groupId: group1.id,
      },
      {
        content: 'Let’s play',
        authorId: users[3].id,
        groupId: group2.id,
      },
    ],
  })

  console.log('Seed COMPLET exécuté')
}
