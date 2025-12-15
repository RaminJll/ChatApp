// src/services/groupsService.ts
import prisma from '../lib/prisma';

export class GroupsService {

  // Créer un groupe
  async createGroupService(name: string, creatorId: string) {
    try {
      const newGroup = await prisma.group.create({
        data: {
          name,
          creatorId,
          members: {
            create: {
              userId: creatorId,
              role: 'ADMIN'
            }
          }
        },
        include: {
          members: true
        }
      });
      return newGroup;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les groupes d'un utilisateur
  async getUserGroupsService(userId: string) {
    try {
      const groups = await prisma.group.findMany({
        where: {
          members: {
            some: {
              userId: userId
            }
          }
        },
        include: {
          members: {
            include: {
              user: {
                select: { username: true }
              }
            }
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      return groups;
    } catch (error) {
      throw error;
    }
  }

  // Ajouter un membre
  async addMemberToGroupService(groupId: string, userIdToAdd: string, requesterId: string) {
    try {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: { members: true }
      });
      if (!group) throw new Error("Groupe introuvable");

      const isAlreadyMember = group.members.some(m => m.userId === userIdToAdd);
      if (isAlreadyMember) throw new Error("Cet utilisateur est déjà dans le groupe.");

      const areFriends = await prisma.friendship.findFirst({
        where: {
          status: 'ACCEPTED',
          OR: [
            { senderId: requesterId, receiverId: userIdToAdd },
            { senderId: userIdToAdd, receiverId: requesterId }
          ]
        }
      });

      const newMember = await prisma.groupMember.create({
        data: {
          userId: userIdToAdd,
          groupId: groupId,
          role: 'MEMBER'
        }
      });

      return newMember;
    } catch (error) {
      throw error;
    }
  }

  async getGroupMembersService(groupId: string) {
    try {
      const members = await prisma.groupMember.findMany({
        where: { groupId },
        include: {
          user: { select: { username: true } }
        }
      });
      return members;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des membres du groupe.")
      }
    }
}