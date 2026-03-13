type Props = {
  view: 'friends' | 'groups' | 'search' | 'requests';
  onViewChange: (view: 'friends' | 'groups' | 'search' | 'requests') => void | Promise<void>;
  onCreateGroup: () => void | Promise<void>;
};

export function SidebarHeader({ view, onViewChange, onCreateGroup }: Props) {
  return (
    <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 text-slate-100">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => void onViewChange('friends')}
          className={`flex-1 py-2.5 px-3 rounded-full text-sm font-medium ${
            view === 'friends'
              ? 'bg-blue-900 text-white'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
          }`}
        >
          Amis
        </button>
        <button
          onClick={() => void onViewChange('groups')}
          className={`flex-1 py-2.5 px-3 rounded-full text-sm font-medium ${
            view === 'groups'
              ? 'bg-blue-900 text-white'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
          }`}
        >
          Groupes
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => void onViewChange('search')}
          className="flex-1 py-2.5 px-3 bg-slate-900 rounded-full text-sm text-slate-100 hover:bg-slate-800"
        >
          Rechercher
        </button>
        <button
          onClick={() => void onViewChange('requests')}
          className="flex-1 py-2.5 px-3 bg-slate-900 rounded-full text-sm text-slate-100 hover:bg-slate-800"
        >
          Demandes
        </button>
      </div>

      {view === 'groups' && (
        <button
          onClick={() => void onCreateGroup()}
          className="w-full mt-3 py-2.5 px-3 bg-emerald-500 text-emerald-950 rounded-full text-sm font-semibold hover:bg-emerald-400"
        >
          + Créer un groupe
        </button>
      )}
    </div>
  );
}

