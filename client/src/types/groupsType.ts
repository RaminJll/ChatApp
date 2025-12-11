// src/types/groupsType.ts

export interface GroupMember {
    userId: string;
    groupId: string;
    role: 'ADMIN' | 'MEMBER';
    joinedAt: string;
}

export interface Group {
    id: string;
    name: string;
    creatorId: string;
    createdAt: string;
    members: GroupMember[];
    // affichage du dernier message
    messages?: { content: string, createdAt: string }[];
}

export interface CreateGroupResponse {
    message: string;
    data: Group;
}