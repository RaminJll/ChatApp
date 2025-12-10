// src/types/friendsType.ts

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED';

export interface Friendship {
  senderId: string;
  receiverId: string;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequestResponse {
  message: string;
  data: Friendship;
}

export interface ReceivedRequest {
  senderId: string;
  receiverId: string;
  status: FriendshipStatus;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    email: string;
  };
}