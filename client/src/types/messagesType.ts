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
    
    groupId?: string | null;
    directMessageId?: string | null;
}

export interface SendMessagePayload {
    content: string;
    receiverId?: string;
    groupId?: string; 
}