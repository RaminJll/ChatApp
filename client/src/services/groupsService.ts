// src/services/groupsService.ts

import axios from 'axios';
import { type Group, type CreateGroupResponse } from '../types/groupsType';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

// Créer un groupe
export const createGroupApi = async (name: string): Promise<CreateGroupResponse> => {
    const response = await axios.post<CreateGroupResponse>(
        '/api/groups/create',
        { name },
        { headers: getAuthHeader() }
    );
    return response.data;
};

// Récupérer mes groupes
export const getUserGroupsApi = async (): Promise<Group[]> => {
    const response = await axios.get<Group[]>(
        '/api/groups/list',
        { headers: getAuthHeader() }
    );
    return response.data;
};

// Ajouter un membre
export const addMemberToGroupApi = async (groupId: string, userIdToAdd: string) => {
    const response = await axios.post(
        '/api/groups/add-member',
        { groupId, userIdToAdd },
        { headers: getAuthHeader() }
    );
    return response.data;
};