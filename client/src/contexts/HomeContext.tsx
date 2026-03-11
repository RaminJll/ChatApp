import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useAuthSession } from '../hooks/useAuthSession';
import { useFriends } from '../hooks/useFriends';
import { useGroups } from '../hooks/useGroups';
import { useMessages } from '../hooks/useMessages';

import type { Group } from '../types/groupsType';
import type { User } from '../types/userType';

type HomeView = 'friends' | 'groups' | 'search' | 'requests';

type HomeContextValue = {
  userId: string;
  logout: () => void;

  view: HomeView;
  changeView: (nextView: HomeView) => Promise<void>;

  selectedFriend: User | null;
  setSelectedFriend: (friend: User | null) => void;
  selectedGroup: Group | null;
  setSelectedGroup: (group: Group | null) => void;

  searchText: string;
  setSearchText: (value: string) => void;
  searchResults: User[];

  messageText: string;
  setMessageText: (value: string) => void;
  sendMessage: () => Promise<void>;

  showAddMember: boolean;
  toggleAddMember: () => void;
  availableFriends: User[];
  addMember: (friendId: string) => Promise<void>;

  friends: ReturnType<typeof useFriends>;
  groups: ReturnType<typeof useGroups>;
  messages: ReturnType<typeof useMessages>;

  createGroup: () => Promise<void>;
};

const HomeContext = createContext<HomeContextValue | null>(null);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const { userId, logout } = useAuthSession();
  const friends = useFriends();
  const groups = useGroups();
  const messages = useMessages(userId);

  const [view, setView] = useState<HomeView>('friends');
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchText, setSearchText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    friends.loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedFriend) {
      messages.loadFriendMessages(String(selectedFriend.id));
    }
    if (selectedGroup) {
      messages.loadGroupMessages(selectedGroup.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFriend, selectedGroup]);

  const searchResults = useMemo(() => {
    if (!searchText.trim()) return [];
    const friendIds = friends.friends.map(f => f.id);
    return friends.allUsers.filter(
      u => u.username.includes(searchText) && !friendIds.includes(u.id) && String(u.id) !== String(userId)
    );
  }, [searchText, friends.allUsers, friends.friends, userId]);

  const availableFriends = useMemo(() => {
    if (!selectedGroup) return [];
    return friends.friends.filter(f => {
      const isAlreadyMember = selectedGroup.members.some(m => String(m.userId) === String(f.id));
      return !isAlreadyMember;
    });
  }, [friends.friends, selectedGroup]);

  async function changeView(nextView: HomeView) {
    setView(nextView);
    setSearchText('');
    setSelectedFriend(null);
    setSelectedGroup(null);
    setShowAddMember(false);

    if (nextView === 'groups') await groups.loadGroups();
    if (nextView === 'search') await friends.loadAllUsers();
    if (nextView === 'requests') await friends.loadRequests();
  }

  async function sendMessage() {
    if (!messageText.trim()) return;

    const receiverId = selectedFriend ? String(selectedFriend.id) : undefined;
    const groupId = selectedGroup ? selectedGroup.id : undefined;

    await messages.sendMessage(messageText, receiverId, groupId);
    setMessageText('');
  }

  async function createGroup() {
    const name = prompt('Nom du groupe :');
    if (!name?.trim()) return;
    await groups.createGroup(name);
    await changeView('groups');
  }

  async function addMember(friendId: string) {
    if (!selectedGroup) return;
    await groups.addMember(selectedGroup.id, friendId);
    setShowAddMember(false);
  }

  function toggleAddMember() {
    setShowAddMember(v => !v);
  }

  const value: HomeContextValue = {
    userId,
    logout: () => logout(messages.socket),

    view,
    changeView,

    selectedFriend,
    setSelectedFriend,
    selectedGroup,
    setSelectedGroup,

    searchText,
    setSearchText,
    searchResults,

    messageText,
    setMessageText,
    sendMessage,

    showAddMember,
    toggleAddMember,
    availableFriends,
    addMember,

    friends,
    groups,
    messages,

    createGroup
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHomeContext() {
  const ctx = useContext(HomeContext);
  if (!ctx) throw new Error('useHomeContext doit être utilisé à l’intérieur de <HomeProvider>');
  return ctx;
}
