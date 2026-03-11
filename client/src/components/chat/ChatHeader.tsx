type Props = {
  title?: string;
  subtitle?: string;
  showAddMemberButton: boolean;
  onToggleAddMember: () => void;
};

export function ChatHeader({ title, subtitle, showAddMemberButton, onToggleAddMember }: Props) {
  return (
    <div className="p-4 border-b bg-white flex justify-between items-center">
      <div>
        <div className="font-semibold text-lg">{title}</div>
        {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
      </div>

      {showAddMemberButton && (
        <button onClick={onToggleAddMember} className="px-4 py-2 bg-blue-500 text-white rounded">
          + Ajouter membre
        </button>
      )}
    </div>
  );
}

