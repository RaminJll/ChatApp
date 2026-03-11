type Props = {
  onLogout: () => void;
};

export function SidebarFooter({ onLogout }: Props) {
  return (
    <div className="p-4 border-t">
      <button onClick={onLogout} className="w-full py-2 px-3 bg-red-500 text-white rounded">
        Déconnexion
      </button>
    </div>
  );
}

