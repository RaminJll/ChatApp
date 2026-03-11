import type { Message } from '../../types/messagesType';

type Props = {
  messages: Message[];
  currentUserId: string;
  isGroupChat: boolean;
};

export function MessagesList({ messages, currentUserId, isGroupChat }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map(message => {
        const isMyMessage = String(message.authorId) === String(currentUserId);

        return (
          <div key={message.id} className={`mb-3 ${isMyMessage ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block max-w-[70%] p-3 rounded ${
                isMyMessage ? 'bg-blue-500 text-white' : 'bg-white border'
              }`}
            >
              {!isMyMessage && isGroupChat && (
                <div className="text-xs font-bold mb-1 text-blue-600">{message.author.username}</div>
              )}

              <div>{message.content}</div>

              <div className={`text-xs mt-1 ${isMyMessage ? 'text-blue-100' : 'text-gray-400'}`}>
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

