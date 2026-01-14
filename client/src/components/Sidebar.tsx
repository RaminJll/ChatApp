// src/components/Sidebar.tsx
import type { User } from '../types/userType';
import type { ReceivedRequest } from '../types/friendsType';
import type { Group } from '../types/groupsType';

interface SidebarProps {
    view: 'friends' | 'groups' | 'search' | 'requests';
    friends: User[];
    groups: Group[];
    requests: ReceivedRequest[];
    searchQuery: string;
    searchResults: User[];
    selectedFriend: User | null;
    selectedGroup: Group | null;
    onViewChange: (view: 'friends' | 'groups' | 'search' | 'requests') => void;
    onSearchChange: (query: string) => void;
    onFriendClick: (friend: User) => void;
    onGroupClick: (group: Group) => void;
    onSendRequest: (userId: string) => void;
    onAcceptRequest: (senderId: string) => void;
    onRefuseRequest: (senderId: string) => void;
    onCreateGroup: () => void;
    onLogout: () => void;
}

export default function Sidebar(props: SidebarProps) {

    // Liste à afficher selon la vue
    let list : any[];

    switch (props.view) {
        case 'friends':
            list = props.friends;
            break;
        case 'groups':
            list = props.groups;
            break;
        case 'search':
            list = props.searchResults;
            break;
        case 'requests':
            list = props.requests;
            break;
        default:
            list = [];
    }

    return (
        <div className="w-64 bg-white border-r flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => props.onViewChange('friends')}
                        className={`flex-1 py-2 px-3 rounded ${props.view === 'friends' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    >
                        Amis
                    </button>
                    <button
                        onClick={() => props.onViewChange('groups')}
                        className={`flex-1 py-2 px-3 rounded ${props.view === 'groups' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    >
                        Groupes
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => props.onViewChange('search')}
                        className="flex-1 py-2 px-3 bg-gray-100 rounded text-sm"
                    >
                        Rechercher
                    </button>
                    <button
                        onClick={() => props.onViewChange('requests')}
                        className="flex-1 py-2 px-3 bg-gray-100 rounded text-sm"
                    >
                        Demandes
                    </button>
                </div>

                {props.view === 'groups' && (
                    <button
                        onClick={props.onCreateGroup}
                        className="w-full mt-2 py-2 px-3 bg-green-500 text-white rounded text-sm"
                    >
                        + Créer un groupe
                    </button>
                )}
            </div>

            {/* Search input */}
            {props.view === 'search' && (
                <div className="p-4 border-b">
                    <input
                        type="text"
                        value={props.searchQuery}
                        onChange={(e) => props.onSearchChange(e.target.value)}
                        placeholder="Rechercher..."
                        className="w-full p-2 border rounded"
                        autoFocus
                    />
                </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
                {list.map(item => {
                    // Friend
                    if (props.view === 'friends') {
                        const isSelected = props.selectedFriend?.id === item.id;
                        return (
                            <div
                                key={item.id}
                                onClick={() => props.onFriendClick(item)}
                                className={`p-3 mb-1 rounded cursor-pointer ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            >
                                {item.username}
                            </div>
                        );
                    }

                    // Group
                    if (props.view === 'groups') {
                        const isSelected = props.selectedGroup?.id === item.id;
                        return (
                            <div
                                key={item.id}
                                onClick={() => props.onGroupClick(item)}
                                className={`p-3 mb-1 rounded cursor-pointer ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            >
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.members.length} membres</div>
                            </div>
                        );
                    }

                    // Search result
                    if (props.view === 'search') {
                        return (
                            <div key={item.id} className="p-3 mb-1 rounded border flex justify-between items-center">
                                <div>{item.username}</div>
                                <button
                                    onClick={() => props.onSendRequest(String(item.id))}
                                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                >
                                    Ajouter
                                </button>
                            </div>
                        );
                    }

                    // Request
                    return (
                        <div key={item.senderId} className="p-3 mb-1 rounded border">
                            <div className="font-medium mb-2">{item.sender.username}</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => props.onAcceptRequest(item.senderId)}
                                    className="flex-1 py-1 bg-green-500 text-white rounded text-sm"
                                >
                                    Accepter
                                </button>
                                <button
                                    onClick={() => props.onRefuseRequest(item.senderId)}
                                    className="flex-1 py-1 bg-red-500 text-white rounded text-sm"
                                >
                                    Refuser
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Logout */}
            <div className="p-4 border-t">
                <button
                    onClick={props.onLogout}
                    className="w-full py-2 px-3 bg-red-500 text-white rounded"
                >
                    Déconnexion
                </button>
            </div>
        </div>
    );
}