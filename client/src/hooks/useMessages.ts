// src/hooks/useMessages.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  getDirectMessagesApi,
  getGroupMessagesApi,
  sendDirectMessageApi,
  sendGroupMessageApi
} from '../services/messagesService';
import type { Message } from '../types/messagesType';

export function useMessages(userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!userId || !token) return;

    const s = io('http://localhost:3000', {
      auth: { token }
    });

    // store socket in ref (avoid re-renders)
    socketRef.current = s;

    const handleReceive = (msg: Message) => setMessages(prev => [...prev, msg]);

    s.on('receive_message', handleReceive);
    s.emit('join_user_room', userId);

    return () => {
      s.off('receive_message', handleReceive);
      try {
        s.emit('leave_user_room', userId);
      } catch (e) {
        // ignore if socket already closed
      }
      s.disconnect();
      if (socketRef.current === s) socketRef.current = null;
    };
  }, [userId]);

  async function loadFriendMessages(friendId: string) {
    setMessages(await getDirectMessagesApi(friendId));
  }

  async function loadGroupMessages(groupId: string) {
    setMessages(await getGroupMessagesApi(groupId));
    socketRef.current?.emit('join_group_room', groupId);
  }

  async function sendMessage(
    content: string,
    friendId?: string,
    groupId?: string
  ) {
    if (friendId) await sendDirectMessageApi(friendId, content);
    if (groupId) await sendGroupMessageApi(groupId, content);
  }

  return { messages, loadFriendMessages, loadGroupMessages, sendMessage, socket: socketRef.current };
}
