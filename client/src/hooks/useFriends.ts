// src/hooks/useFriends.ts
import { useState } from 'react';
import {
  getFriendsListApi,
  getReceivedRequestsApi,
  sendFriendRequestApi,
  acceptFriendRequestApi,
  refuseFriendRequestApi
} from '../services/friendsService';
import { getAllUsersService } from '../services/usersService';
import type { User } from '../types/userType';
import type { ReceivedRequest } from '../types/friendsType';

export function useFriends() {
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<ReceivedRequest[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  async function loadFriends() {
    setFriends(await getFriendsListApi());
  }

  async function loadRequests() {
    setRequests(await getReceivedRequestsApi());
  }

  async function loadAllUsers() {
    setAllUsers(await getAllUsersService());
  }

  async function sendRequest(userId: string) {
    await sendFriendRequestApi(userId);
  }

  async function acceptRequest(senderId: string) {
    await acceptFriendRequestApi(senderId);
    setRequests(r => r.filter(req => req.senderId !== senderId));
    loadFriends();
  }

  async function refuseRequest(senderId: string) {
    await refuseFriendRequestApi(senderId);
    setRequests(r => r.filter(req => req.senderId !== senderId));
  }

  return {
    friends,
    requests,
    allUsers,
    loadFriends,
    loadRequests,
    loadAllUsers,
    sendRequest,
    acceptRequest,
    refuseRequest
  };
}
