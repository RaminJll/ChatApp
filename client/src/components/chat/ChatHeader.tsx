type Props = {
  title?: string;
  subtitle?: string;
  showAddMemberButton: boolean;
  onToggleAddMember: () => void;
};

export function ChatHeader({ title, subtitle, showAddMemberButton, onToggleAddMember }: Props) {
  return (
    <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
      <div className="min-w-0">
        <div className="font-semibold text-lg text-slate-50 truncate">
          {title ?? 'Sélectionnez une conversation'}
        </div>
        {subtitle && <div className="text-sm text-slate-400 mt-0.5">{subtitle}</div>}
      </div>

      {showAddMemberButton && (
        <button
          onClick={onToggleAddMember}
          className="px-4 py-2 rounded-full bg-slate-800 text-slate-100 text-sm font-medium border border-slate-600 hover:bg-slate-700 transition-colors"
        >
          + Ajouter membre
        </button>
      )}
    </div>
  );
}

