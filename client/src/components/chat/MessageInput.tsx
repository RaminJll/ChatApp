import type { KeyboardEvent } from 'react';

type Props = {
  value: string;
  onChange: (next: string) => void;
  onSend: () => void;
};

export function MessageInput({ value, onChange, onSend }: Props) {
  function handleKeyPress(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') onSend();
  }

  return (
    <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex gap-3">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Écrire un message..."
        className="flex-1 px-5 py-3 text-lg border border-slate-700 rounded-full bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        onClick={onSend}
        className="px-6 py-3 rounded-full bg-blue-900 text-white text-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        Envoyer
      </button>
    </div>
  );
}

