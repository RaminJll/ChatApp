type Props = {
  view: 'friends' | 'groups' | 'search' | 'requests';
  onViewChange: (view: 'friends' | 'groups' | 'search' | 'requests') => void | Promise<void>;
  onCreateGroup: () => void | Promise<void>;
};

export function SidebarHeader({ view, onViewChange, onCreateGroup }: Props) {
  return (
    <div className="p-4 border-b">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => void onViewChange('friends')}
          className={`flex-1 py-2 px-3 rounded ${view === 'friends' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          Amis
        </button>
        <button
          onClick={() => void onViewChange('groups')}
          className={`flex-1 py-2 px-3 rounded ${view === 'groups' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          Groupes
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => void onViewChange('search')} className="flex-1 py-2 px-3 bg-gray-100 rounded text-sm">
          Rechercher
        </button>
        <button onClick={() => void onViewChange('requests')} className="flex-1 py-2 px-3 bg-gray-100 rounded text-sm">
          Demandes
        </button>
      </div>

      {view === 'groups' && (
        <button
          onClick={() => void onCreateGroup()}
          className="w-full mt-2 py-2 px-3 bg-green-500 text-white rounded text-sm"
        >
          + Créer un groupe
        </button>
      )}
    </div>
  );
}

