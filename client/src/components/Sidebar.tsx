// src/components/Sidebar.tsx
import { useHomeContext } from '../contexts/HomeContext';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarList } from './sidebar/SidebarList';
import { SidebarSearch } from './sidebar/SidebarSearch';

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
        logout
    } = useHomeContext();

    return (
        <div className="w-64 bg-white border-r flex flex-col">
            <SidebarHeader view={view} onViewChange={changeView} onCreateGroup={createGroup} />

            {view === 'search' && <SidebarSearch value={searchText} onChange={setSearchText} />}

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
                onSendRequest={friends.sendRequest}
                onAcceptRequest={friends.acceptRequest}
                onRefuseRequest={friends.refuseRequest}
            />

            <SidebarFooter onLogout={logout} />
        </div>
    );
}