// src/services/messagesService.ts

import prisma from '../lib/prisma';

export class MessagesService {

  // Envoyer un message privé
  async sendDirectMessage(senderId: string, receiverId: string, content: string) {
    let conversation = await prisma.directMessage.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId }
        ]
      }
    });

    if (!conversation) {
      conversation = await prisma.directMessage.create({
        data: {
          user1Id: senderId,
          user2Id: receiverId
        }
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        content,
        authorId: senderId,
        directMessageId: conversation.id
      },
      include: {
        author: { select: { id: true, username: true } }
      }
    });

    return newMessage;
  }

  // 2. Récupérer l'historique privé
  async getDirectMessages(userId: string, contactId: string) {
    const conversation = await prisma.directMessage.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: contactId },
          { user1Id: contactId, user2Id: userId }
        ]
      }
    });

    if (!conversation) return [];

    const messages = await prisma.message.findMany({
      where: { directMessageId: conversation.id },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, username: true } }
      }
    });

    return messages;
  }


  // Envoyer un message de groupe
  async sendGroupMessage(senderId: string, groupId: string, content: string) {
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new Error("Groupe introuvable");

    const newMessage = await prisma.message.create({
      data: {
        content,
        authorId: senderId,
        groupId: groupId
      },
      include: {
        author: { select: { id: true, username: true } }
      }
    });

    return newMessage;
  }

  // Récupérer l'historique de groupe
  async getGroupMessages(groupId: string) {
    const messages = await prisma.message.findMany({
      where: { groupId: groupId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, username: true } }
      }
    });
    return messages;
  }
}