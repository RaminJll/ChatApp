// src/components/ChatArea.tsx
import { useHomeContext } from '../contexts/HomeContext';
import { AddMemberModal } from './chat/AddMemberModal';
import { ChatHeader } from './chat/ChatHeader';
import { MessageInput } from './chat/MessageInput';
import { MessagesList } from './chat/MessagesList';

export default function ChatArea() {
    const {
        userId,
        selectedFriend,
        selectedGroup,
        messages,
        messageText,
        setMessageText,
        sendMessage,
        showAddMember,
        toggleAddMember,
        availableFriends,
        addMember
    } = useHomeContext();

    // Déterminer si c'est une conversation de groupe ou privée
    const isGroupChat = selectedGroup;

    const chatName = isGroupChat ? selectedGroup?.name : selectedFriend?.username;
    const chatSubtitle = isGroupChat ? `${selectedGroup!.members.length} membres` : undefined;

    return (
        <div className="flex-1 flex flex-col">
            <ChatHeader
                title={chatName}
                subtitle={chatSubtitle}
                showAddMemberButton={Boolean(isGroupChat)}
                onToggleAddMember={toggleAddMember}
            />

            <MessagesList messages={messages.messages} currentUserId={userId} isGroupChat={Boolean(isGroupChat)} />

            <MessageInput value={messageText} onChange={setMessageText} onSend={() => void sendMessage()} />

            <AddMemberModal
                isOpen={Boolean(showAddMember && isGroupChat)}
                availableFriends={availableFriends}
                onClose={toggleAddMember}
                onAddMember={(friendId) => void addMember(friendId)}
            />
        </div>
    );
}