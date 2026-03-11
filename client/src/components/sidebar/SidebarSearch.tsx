type Props = {
  value: string;
  onChange: (next: string) => void;
};

export function SidebarSearch({ value, onChange }: Props) {
  return (
    <div className="p-4 border-b">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Rechercher..."
        className="w-full p-2 border rounded"
        autoFocus
      />
    </div>
  );
}

