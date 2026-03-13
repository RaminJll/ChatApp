import type { Message } from '../../types/messagesType';

type Props = {
  messages: Message[];
  currentUserId: string;
  isGroupChat: boolean;
};

export function MessagesList({ messages, currentUserId, isGroupChat }: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 bg-slate-900/40">
      {messages.map(message => {
        const isMyMessage = String(message.authorId) === String(currentUserId);

        return (
          <div
            key={message.id}
            className={`mb-2 flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`inline-block max-w-[70%] rounded-2xl px-5 py-3.5 text-lg ${
                isMyMessage
                  ? 'bg-sky-900 text-white'
                  : 'bg-slate-800 border border-slate-700 text-slate-100'
              }`}
            >
              {!isMyMessage && isGroupChat && (
                <div className="text-[11px] font-semibold mb-1 text-slate-500">
                  {message.author.username}
                </div>
              )}

              <div>{message.content}</div>

              <div className={`text-[11px] mt-1 ${isMyMessage ? 'text-blue-100' : 'text-slate-400'}`}>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

