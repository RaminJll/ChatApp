import type { User } from '../../types/userType';

type Props = {
  isOpen: boolean;
  availableFriends: User[];
  onClose: () => void;
  onAddMember: (friendId: string) => void;
};

export function AddMemberModal({ isOpen, availableFriends, onClose, onAddMember }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ajouter un membre</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {availableFriends.length === 0 ? (
            <div className="text-center text-gray-400 py-4">Tous vos amis sont déjà dans ce groupe</div>
          ) : (
            availableFriends.map(friend => (
              <div key={friend.id} className="flex justify-between items-center p-2 border-b">
                <div>{friend.username}</div>
                <button
                  onClick={() => onAddMember(String(friend.id))}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                >
                  Ajouter
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

