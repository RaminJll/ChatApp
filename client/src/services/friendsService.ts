// src/services/friendsService.ts
import { api } from './api';
import { type FriendRequestResponse, type ReceivedRequest } from '../types/friendsType';
import { type User } from '../types/userType';

// Envoyer une demande
export const sendFriendRequestApi = async (receiverId: string): Promise<FriendRequestResponse> => {
  const response = await api.post(
    '/api/friends/request',
    { receiverId }
  );
  return response.data;
};

// Récupérer les demandes reçues
export const getReceivedRequestsApi = async (): Promise<ReceivedRequest[]> => {
  const response = await api.get<ReceivedRequest[]>('/api/friends/received');
  return response.data;
};

// Accepter une demande
export const acceptFriendRequestApi = async (senderId: string) => {
  const response = await api.patch(
    `/api/friends/request/${senderId}/accept`,
    {}
  );
  return response.data;
};

// Refuser une demande
export const refuseFriendRequestApi = async (senderId: string) => {
  const response = await api.delete(`/api/friends/request/${senderId}/refuse`);
  return response.data;
};

// Récupérer la liste d'amis
export const getFriendsListApi = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/api/friends/list');
  return response.data;
};