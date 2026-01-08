// src/components/ChatArea.tsx
import type { User } from '../types/userType';
import type { Group } from '../types/groupsType';
import type { Message } from '../types/messagesType';

interface ChatAreaProps {
    currentUserId: string;
    selectedFriend: User | null;
    selectedGroup: Group | null;
    messages: Message[];
    messageInput: string;
    showAddMember: boolean;
    availableFriends: User[];
    onMessageChange: (value: string) => void;
    onSendMessage: () => void;
    onToggleAddMember: () => void;
    onAddMember: (friendId: string) => void;
}

export default function ChatArea(props: ChatAreaProps) {
    // Si aucun ami ni groupe n'est sélectionné
    if (!props.selectedFriend && !props.selectedGroup) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-400">
                    <div className="text-5xl mb-4">💬</div>
                    <div>Sélectionnez une conversation</div>
                </div>
            </div>
        );
    }

    // Déterminer si c'est une conversation de groupe ou privée
    const isGroupChat = props.selectedGroup !== null;
    
    // Obtenir le nom à afficher
    const chatName = isGroupChat 
        ? props.selectedGroup!.name 
        : props.selectedFriend!.username;

    // Fonction pour envoyer le message quand on appuie sur Entrée
    function handleKeyPress(event: React.KeyboardEvent) {
        if (event.key === 'Enter') {
            props.onSendMessage();
        }
    }

    return (
        <div className="flex-1 flex flex-col">
            {/* En-tête de la conversation */}
            <div className="p-4 border-b bg-white flex justify-between items-center">
                <div>
                    <div className="font-semibold text-lg">{chatName}</div>
                    
                    {/* Afficher le nombre de membres si c'est un groupe */}
                    {isGroupChat && (
                        <div className="text-sm text-gray-500">
                            {props.selectedGroup!.members.length} membres
                        </div>
                    )}
                </div>
                
                {/* Bouton pour ajouter un membre (seulement pour les groupes) */}
                {isGroupChat && (
                    <button 
                        onClick={props.onToggleAddMember} 
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        + Ajouter membre
                    </button>
                )}
            </div>

            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {props.messages.map(message => {
                    // Vérifier si le message a été envoyé par l'utilisateur actuel
                    const isMyMessage = String(message.authorId) === String(props.currentUserId);
                    
                    return (
                        <div 
                            key={message.id} 
                            className={`mb-3 ${isMyMessage ? 'text-right' : 'text-left'}`}
                        >
                            <div
                                className={`inline-block max-w-[70%] p-3 rounded ${
                                    isMyMessage 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-white border'
                                }`}
                            >
                                {/* Afficher le nom de l'auteur (seulement dans les groupes et si ce n'est pas moi) */}
                                {!isMyMessage && isGroupChat && (
                                    <div className="text-xs font-bold mb-1 text-blue-600">
                                        {message.author.username}
                                    </div>
                                )}
                                
                                {/* Contenu du message */}
                                <div>{message.content}</div>
                                
                                {/* Heure du message */}
                                <div className={`text-xs mt-1 ${
                                    isMyMessage ? 'text-blue-100' : 'text-gray-400'
                                }`}>
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

            {/* Zone de saisie du message */}
            <div className="p-4 border-t bg-white flex gap-2">
                <input
                    type="text"
                    value={props.messageInput}
                    onChange={(e) => props.onMessageChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Écrire un message..."
                    className="flex-1 p-2 border rounded"
                />
                <button
                    onClick={props.onSendMessage}
                    className="px-6 py-2 bg-blue-500 text-white rounded"
                >
                    Envoyer
                </button>
            </div>

            {/* Modal pour ajouter un membre au groupe */}
            {props.showAddMember && isGroupChat && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded p-6 w-96">
                        {/* En-tête du modal */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Ajouter un membre</h3>
                            <button
                                onClick={props.onToggleAddMember}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* Liste des amis disponibles */}
                        <div className="max-h-64 overflow-y-auto">
                            {props.availableFriends.length === 0 ? (
                                <div className="text-center text-gray-400 py-4">
                                    Tous vos amis sont déjà dans ce groupe
                                </div>
                            ) : (
                                props.availableFriends.map(friend => (
                                    <div
                                        key={friend.id}
                                        className="flex justify-between items-center p-2 border-b"
                                    >
                                        <div>{friend.username}</div>
                                        <button
                                            onClick={() => props.onAddMember(String(friend.id))}
                                            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}