// src/components/Sidebar.tsx
import { useHomeContext } from '../contexts/HomeContext';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarList } from './sidebar/SidebarList';
import { SidebarSearch } from './sidebar/SidebarSearch';
import { toast } from 'sonner';

export default function Sidebar() {
  const {
    view,
    changeView,
    searchText,
    setSearchText,
    searchResults,
    selectedFriend,
    setSelectedFriend,
    selectedGroup,
    setSelectedGroup,
    friends,
    groups,
    createGroup,
    logout,
  } = useHomeContext();

  const handleSendRequest = async (userId: string) => {
    try {
      await friends.sendRequest(userId);
      toast.success("Demande d'ami envoyée !");
    } catch {
      toast.error("Impossible d'envoyer la demande d'ami.");
    }
  };

  return (
    <aside className="w-80 bg-slate-950 border-r border-slate-900 flex flex-col">
      <SidebarHeader
        view={view}
        onViewChange={changeView}
        onCreateGroup={createGroup}
      />

      {view === 'search' && (
        <SidebarSearch value={searchText} onChange={setSearchText} />
      )}

      <SidebarList
        view={view}
        friends={friends.friends}
        groups={groups.groups}
        searchResults={searchResults}
        requests={friends.requests}
        selectedFriend={selectedFriend}
        selectedGroup={selectedGroup}
        onFriendClick={setSelectedFriend}
        onGroupClick={setSelectedGroup}
        onSendRequest={handleSendRequest}
        onAcceptRequest={friends.acceptRequest}
        onRefuseRequest={friends.refuseRequest}
      />

      <SidebarFooter onLogout={logout} />
    </aside>
  );
}