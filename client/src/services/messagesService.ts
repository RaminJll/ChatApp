// src/services/messagesService.ts
import { api } from './api';
import { type Message } from '../types/messagesType';

// Envoyer un message privé
export const sendDirectMessageApi = async (receiverId: string, content: string): Promise<Message> => {
    const response = await api.post<Message>(
        '/api/messages/direct',
        { receiverId, content }
    );
    return response.data;
};

// Récupérer la conversation privée
export const getDirectMessagesApi = async (contactId: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/api/messages/direct/${contactId}`);
    return response.data;
};

// Envoyer un message de groupe
export const sendGroupMessageApi = async (groupId: string, content: string): Promise<Message> => {
    const response = await api.post<Message>(
        '/api/messages/group',
        { groupId, content }
    );
    return response.data;
};

// Récupérer les messages du groupe
export const getGroupMessagesApi = async (groupId: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/api/messages/group/${groupId}`);
    return response.data;
};