// src/hooks/useGroups.ts
import { useState } from 'react';
import {
  createGroupApi,
  getUserGroupsApi,
  addMemberToGroupApi
} from '../services/groupsService';
import type { Group } from '../types/groupsType';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);

  async function loadGroups() {
    setGroups(await getUserGroupsApi());
  }

  async function createGroup(name: string) {
    await createGroupApi(name);
    loadGroups();
  }

  async function addMember(groupId: string, friendId: string) {
    await addMemberToGroupApi(groupId, friendId);
    loadGroups();
  }

  return { groups, loadGroups, createGroup, addMember };
}
