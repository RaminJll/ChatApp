// src/pages/HomePage.tsx
import { useEffect, useState } from 'react';

// Hooks
import { useAuthSession } from '../hooks/useAuthSession';
import { useFriends } from '../hooks/useFriends';
import { useGroups } from '../hooks/useGroups';
import { useMessages } from '../hooks/useMessages';

// Components
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';

// Types
import type { User } from '../types/userType';
import type { Group } from '../types/groupsType';

export default function HomePage() {
  /** ======================
   *  AUTH / SESSION
   ======================= */
  const { userId, logout } = useAuthSession();

  /** ======================
   *  DATA HOOKS
   ======================= */
  const friends = useFriends();
  const groups = useGroups();
  const messages = useMessages(userId);

  /** ======================
   *  UI STATE
   ======================= */
  const [view, setView] = useState<'friends' | 'groups' | 'search' | 'requests'>('friends');
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchText, setSearchText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  /** ======================
   *  INITIAL LOAD
   ======================= */
  useEffect(() => {
    friends.loadFriends();
  }, []);

  /** ======================
   *  CONVERSATION CHANGE
   ======================= */
  useEffect(() => {
    if (selectedFriend) {
      messages.loadFriendMessages(String(selectedFriend.id));
    }
    if (selectedGroup) {
      messages.loadGroupMessages(selectedGroup.id);
    }
  }, [selectedFriend, selectedGroup]);

  /** ======================
   *  VIEW CHANGE
   ======================= */
  async function changeView(nextView: typeof view) {
    setView(nextView);
    setSearchText('');
    setSelectedFriend(null);
    setSelectedGroup(null);

    if (nextView === 'groups') await groups.loadGroups();
    if (nextView === 'search') await friends.loadAllUsers();
    if (nextView === 'requests') await friends.loadRequests();
  }

  /** ======================
   *  ACTIONS
   ======================= */
  async function sendMessage() {
    if (!messageText.trim()) return;

    await messages.sendMessage(
      messageText,
      selectedFriend ? String(selectedFriend.id) : undefined,
      selectedGroup ? selectedGroup.id : undefined
    );

    setMessageText('');
  }

  async function createGroup() {
    const name = prompt('Nom du groupe :');
    if (!name?.trim()) return;

    await groups.createGroup(name);
    changeView('groups');
  }

  async function addMember(friendId: string) {
    if (!selectedGroup) return;

    await groups.addMember(selectedGroup.id, friendId);
    setShowAddMember(false);
  }

  /** ======================
   *  DERIVED DATA
   ======================= */
  const searchResults = searchText
    ? friends.allUsers.filter(u =>
        u.username.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const availableFriends = selectedGroup
    ? friends.friends.filter(
        f => !selectedGroup.members.some(m => String(m.userId) === String(f.id))
      )
    : [];

  /** ======================
   *  RENDER
   ======================= */
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        view={view}
        friends={friends.friends}
        groups={groups.groups}
        requests={friends.requests}
        searchQuery={searchText}
        searchResults={searchResults}
        selectedFriend={selectedFriend}
        selectedGroup={selectedGroup}
        onViewChange={changeView}
        onSearchChange={setSearchText}
        onFriendClick={setSelectedFriend}
        onGroupClick={setSelectedGroup}
        onSendRequest={friends.sendRequest}
        onAcceptRequest={friends.acceptRequest}
        onRefuseRequest={friends.refuseRequest}
        onCreateGroup={createGroup}
        onLogout={() => logout(messages.socket)}
      />

      <ChatArea
        currentUserId={userId}
        selectedFriend={selectedFriend}
        selectedGroup={selectedGroup}
        messages={messages.messages}
        messageInput={messageText}
        showAddMember={showAddMember}
        availableFriends={availableFriends}
        onMessageChange={setMessageText}
        onSendMessage={sendMessage}
        onToggleAddMember={() => setShowAddMember(v => !v)}
        onAddMember={addMember}
      />
    </div>
  );
}
