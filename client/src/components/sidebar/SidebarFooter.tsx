type Props = {
  onLogout: () => void;
};

export function SidebarFooter({ onLogout }: Props) {
  return (
    <div className="px-5 py-4 bg-slate-950">
      <button
        onClick={onLogout}
        className="w-full py-2.5 px-3 bg-red-900 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
      >
        Déconnexion
      </button>
    </div>
  );
}

