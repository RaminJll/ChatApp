// src/services/messagesService.ts
import axios from 'axios';
import { type Message } from '../types/messagesType';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

// Envoyer un message privé
export const sendDirectMessageApi = async (receiverId: string, content: string): Promise<Message> => {
    const response = await axios.post<Message>(
        '/api/messages/direct',
        { receiverId, content },
        { headers: getAuthHeader() }
    );
    return response.data;
};

// Récupérer la conversation privée
export const getDirectMessagesApi = async (contactId: string): Promise<Message[]> => {
    const response = await axios.get<Message[]>(
        `/api/messages/direct/${contactId}`,
        { headers: getAuthHeader() }
    );
    return response.data;
};

// Envoyer un message de groupe
export const sendGroupMessageApi = async (groupId: string, content: string): Promise<Message> => {
    const response = await axios.post<Message>(
        '/api/messages/group',
        { groupId, content },
        { headers: getAuthHeader() }
    );
    return response.data;
};

// Récupérer les messages du groupe
export const getGroupMessagesApi = async (groupId: string): Promise<Message[]> => {
    const response = await axios.get<Message[]>(
        `/api/messages/group/${groupId}`,
        { headers: getAuthHeader() }
    );
    return response.data;
};