// src/services/friendsService.ts
import prisma from '../lib/prisma';

export class FriendsService {
  async sendRequestService(senderId: string, receiverId: string) {
    try {
      if (senderId === receiverId) {
        throw new Error("Vous ne pouvez pas vous ajouter vous-même.");
      }
      const existingFriendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId }
          ]
        }
      });

      if (existingFriendship) {
        throw new Error("Une demande d'ami ou une amitié existe déjà avec cet utilisateur.");
      }
      const newFriendship = await prisma.friendship.create({
        data: {
          senderId,
          receiverId
        }
      });

      return newFriendship;
      
    } catch (error) {
      throw error;
    }
  }

  async getReceivedRequestsService(userId: string) {
    try {
      const requests = await prisma.friendship.findMany({
        where: {
          receiverId: userId,
          status: 'PENDING'
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });
      return requests;
    } catch (error) {
      throw error;
    }
  }

  async acceptRequestService(receiverId: string, senderIdToAccept: string) {
    try {
      const updatedFriendship = await prisma.friendship.update({
        where: {
          senderId_receiverId: {
            senderId: senderIdToAccept,
            receiverId: receiverId
          }
        },
        data: {
          status: 'ACCEPTED'
        }
      });
      return updatedFriendship;
    } catch (error) {
      throw new Error("Impossible d'accepter la demande (introuvable ou erreur serveur).");
    }
  }

  async refuseRequestService(receiverId: string, senderIdToRefuse: string) {
    try {
      const deletedFriendship = await prisma.friendship.delete({
        where: {
          senderId_receiverId: {
            senderId: senderIdToRefuse,
            receiverId: receiverId
          }
        }
      });
      return deletedFriendship;
    } catch (error) {
      throw new Error("Impossible de refuser la demande (introuvable ou erreur serveur).");
    }
  }

  async getFriendsListService(userId: string) {
    try {
      const friendships = await prisma.friendship.findMany({
        where: {
          status: 'ACCEPTED',
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },

        include: {
          sender: {
            select: { id: true, username: true, email: true }
          },
          receiver: {
            select: { id: true, username: true, email: true }
          }
        }
      });

      const friends = friendships.map(f => {
        if (f.senderId === userId) {
          return f.receiver
        }
        else {
          return f.sender
        }
      });

      return friends;

    } catch (error) {
      throw error;
    }
  }
};