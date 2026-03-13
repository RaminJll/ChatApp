type Props = {
  value: string;
  onChange: (next: string) => void;
};

export function SidebarSearch({ value, onChange }: Props) {
  return (
    <div className="px-5 py-3 border-b border-slate-800 bg-slate-950">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Rechercher..."
        className="w-full px-4 py-2.5 text-base border border-slate-700 rounded-full bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        autoFocus
      />
    </div>
  );
}

