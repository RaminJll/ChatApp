// src/services/groupsService.ts

import { api } from './api';
import { type Group, type CreateGroupResponse } from '../types/groupsType';

// Créer un groupe
export const createGroupApi = async (name: string): Promise<CreateGroupResponse> => {
    const response = await api.post<CreateGroupResponse>(
        '/api/groups/create',
        { name }
    );
    return response.data;
};

// Récupérer mes groupes
export const getUserGroupsApi = async (): Promise<Group[]> => {
    const response = await api.get<Group[]>('/api/groups/list');
    return response.data;
};

// Ajouter un membre
export const addMemberToGroupApi = async (groupId: string, userIdToAdd: string) => {
    const response = await api.post(
        '/api/groups/add-member',
        { groupId, userIdToAdd }
    );
    return response.data;
};