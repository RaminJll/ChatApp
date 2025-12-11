// src/types/messagesType.ts

export interface MessageAuthor {
    id: string;
    username: string;
}

export interface Message {
    id: string;
    content: string;
    createdAt: string;
    authorId: string;
    author: MessageAuthor;
    
    // ⬇️ AJOUTS INDISPENSABLES
    groupId?: string | null;         // Pour identifier si c'est un message de groupe
    directMessageId?: string | null; // Pour identifier la conversation privée (optionnel mais utile)
}

export interface SendMessagePayload {
    content: string;
    receiverId?: string;
    groupId?: string; 
}