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
    <div className="p-4 border-t bg-white flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Écrire un message..."
        className="flex-1 p-2 border rounded"
      />
      <button onClick={onSend} className="px-6 py-2 bg-blue-500 text-white rounded">
        Envoyer
      </button>
    </div>
  );
}

