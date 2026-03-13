import type { Group } from '../../types/groupsType';
import type { ReceivedRequest } from '../../types/friendsType';
import type { User } from '../../types/userType';

type View = 'friends' | 'groups' | 'search' | 'requests';

type Props = {
  view: View;
  friends: User[];
  groups: Group[];
  searchResults: User[];
  requests: ReceivedRequest[];

  selectedFriend: User | null;
  selectedGroup: Group | null;

  onFriendClick: (friend: User) => void;
  onGroupClick: (group: Group) => void;
  onSendRequest: (userId: string) => void | Promise<void>;
  onAcceptRequest: (senderId: string) => void | Promise<void>;
  onRefuseRequest: (senderId: string) => void | Promise<void>;
};

export function SidebarList(props: Props) {
  if (props.view === 'friends') {
    return (
      <div className="flex-1 overflow-y-auto p-2">
        {props.friends.map(friend => {
          const isSelected = props.selectedFriend?.id === friend.id;
          return (
            <div
              key={friend.id}
              onClick={() => props.onFriendClick(friend)}
              className={`p-3 mb-1 rounded cursor-pointer text-white ${isSelected ? 'bg-gray-900' : 'hover:bg-gray-900'}`}
            >
              {friend.username}
            </div>
          );
        })}
      </div>
    );
  }

  if (props.view === 'groups') {
    return (
      <div className="flex-1 overflow-y-auto p-2">
        {props.groups.map(group => {
          const isSelected = props.selectedGroup?.id === group.id;
          return (
            <div
              key={group.id}
              onClick={() => props.onGroupClick(group)}
              className={`p-3 mb-1 rounded cursor-pointer text-white ${isSelected ? 'bg-gray-900' : 'hover:bg-gray-900'}`}
            >
              <div className="font-medium">{group.name}</div>
              <div className="text-xs text-gray-500">{group.members.length} membres</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (props.view === 'search') {
    return (
      <div className="flex-1 overflow-y-auto p-2">
        {props.searchResults.map(user => (
          <div key={user.id} className="p-4 mb-1 rounded text-white flex justify-between items-center">
            <div>{user.username}</div>
            <button
              onClick={() => void props.onSendRequest(String(user.id))}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2">
      {props.requests.map(req => (
        <div key={req.senderId} className="p-4 mb-1 rounded">
          <div className="font-medium mb-2 text-white">{req.sender.username}</div>
          <div className="flex gap-2">
            <button
              onClick={() => void props.onAcceptRequest(req.senderId)}
              className="flex-1 py-1 bg-green-500 text-white rounded text-sm"
            >
              Accepter
            </button>
            <button
              onClick={() => void props.onRefuseRequest(req.senderId)}
              className="flex-1 py-1 bg-red-500 text-white rounded text-sm"
            >
              Refuser
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

