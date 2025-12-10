// src/services/friendsService.ts
import axios from 'axios';
import { type FriendRequestResponse, type ReceivedRequest } from '../types/friendsType';
import { type User } from '../types/userType';

// header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Envoyer une demande
export const sendFriendRequestApi = async (receiverId: string): Promise<FriendRequestResponse> => {
  const response = await axios.post(
    '/api/friends/request',
    { receiverId },
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Récupérer les demandes reçues
export const getReceivedRequestsApi = async (): Promise<ReceivedRequest[]> => {
  const response = await axios.get<ReceivedRequest[]>(
    '/api/friends/received',
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Accepter une demande
export const acceptFriendRequestApi = async (senderId: string) => {
  const response = await axios.patch(
    `/api/friends/request/${senderId}/accept`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

// Refuser une demande
export const refuseFriendRequestApi = async (senderId: string) => {
  const response = await axios.delete(
    `/api/friends/request/${senderId}/refuse`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const getFriendsListApi = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(
    '/api/friends/list',
    { headers: getAuthHeader() }
  );
  return response.data;
};