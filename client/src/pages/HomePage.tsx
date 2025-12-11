// src/pages/HomePage.tsx
import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { getAllUsersService } from '../services/usersService';
import type { User } from '../types/userType';
import {
    sendFriendRequestApi,
    getReceivedRequestsApi,
    acceptFriendRequestApi,
    refuseFriendRequestApi,
    getFriendsListApi
} from '../services/friendsService';
import type { ReceivedRequest } from '../types/friendsType';
import { createGroupApi, getUserGroupsApi, addMemberToGroupApi } from '../services/groupsService';
import type { Group } from '../types/groupsType';
import {
    getDirectMessagesApi,
    sendDirectMessageApi,
    getGroupMessagesApi,
    sendGroupMessageApi
} from '../services/messagesService';
import type { Message } from '../types/messagesType';
import { io, Socket } from 'socket.io-client';

import './HomePage.css';

export default function HomePage() {
    const [viewMode, setViewMode] = useState<'default' | 'search' | 'requests' | 'groups'>('default');
    const [showAddFriendMenu, setShowAddFriendMenu] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsersList, setAllUsersList] = useState<User[]>([]);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [receivedRequests, setReceivedRequests] = useState<ReceivedRequest[]>([]);
    const [friendsList, setFriendsList] = useState<User[]>([]);
    const [groupsList, setGroupsList] = useState<Group[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser.id || '';

    useEffect(() => { fetchFriends(); }, []);

    useEffect(() => {
        // Connexion au backend
        const newSocket = io('http://localhost:3000'); // Port de ton backend
        setSocket(newSocket);

        // Quand on est connecté, on rejoint notre propre salle pour recevoir les MP
        if (currentUserId) {
            newSocket.emit('join_user_room', currentUserId);
        }

        // Nettoyage à la fermeture
        return () => {
            newSocket.disconnect();
        };
    }, [currentUserId]);

    // 3. Gestion des changements de groupe (Rejoindre la salle du groupe)
    useEffect(() => {
        if (socket && selectedGroup) {
            socket.emit('join_group_room', selectedGroup.id);
        }
    }, [selectedGroup, socket]);

    // 4. Écouter les nouveaux messages entrants
    useEffect(() => {
        if (!socket) return;

        // On définit la fonction de réception
        const handleReceiveMessage = (newMessage: Message) => {
            console.log("Message reçu via Socket:", newMessage);
            
            // Logique de filtrage pour savoir si on doit l'afficher maintenant
            // Cas 1 : C'est un message du groupe que je regarde
            const isForCurrentGroup = selectedGroup && newMessage.groupId === selectedGroup.id;
            
            // Cas 2 : C'est un MP de l'ami que je regarde (ou un MP que je viens d'envoyer)
            // On vérifie si l'auteur est l'ami OU si l'auteur est moi (pour le retour visuel instantané)
            const isForCurrentFriend = selectedFriend && (
                (newMessage.authorId === String(selectedFriend.id)) || 
                (newMessage.authorId === currentUserId && !newMessage.groupId) // Message privé venant de moi
            );

            if (isForCurrentGroup || isForCurrentFriend) {
                setMessages((prev) => [...prev, newMessage]);
            } else {
                // Optionnel : Ici tu pourrais incrémenter un compteur de "non lus"
                // ou jouer un son de notification
            }
        };

        // On active l'écouteur
        socket.on('receive_message', handleReceiveMessage);

        // On nettoie l'écouteur pour éviter les doublons
        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, selectedGroup, selectedFriend, currentUserId]);

    const handleSendMessage = async () => {
        if (!messageInput.trim()) return;
        try {
            if (selectedFriend) {
                await sendDirectMessageApi(String(selectedFriend.id), messageInput);
            } else if (selectedGroup) {
                await sendGroupMessageApi(selectedGroup.id, messageInput);
            }
            setMessageInput('');
            // J'ai enlevé setMessages ici, car le socket va recevoir l'événement 'receive_message'
            // que le backend envoie aussi à l'expéditeur.
        } catch (error) {
            console.error(error);
            alert("Erreur envoi");
        }
    };



    const loadDirectMessages = async (friendId: string) => {
        try {
            const msgs = await getDirectMessagesApi(friendId);
            setMessages(msgs);
        } catch (error) {
            console.error("Erreur chargement messages privés", error);
        }
    };

    useEffect(() => {
        if (selectedFriend) {
            loadDirectMessages(String(selectedFriend.id));
        } else if (selectedGroup) {
            loadGroupMessages(selectedGroup.id);
        }
    }, [selectedFriend, selectedGroup]);

    const loadGroupMessages = async (groupId: string) => {
        try {
            const msgs = await getGroupMessagesApi(groupId);
            setMessages(msgs);
        } catch (error) {
            console.error("Erreur chargement messages groupe", error);
        }
    };

    // Gestion de la touche "Entrée"
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const fetchFriends = async () => {
        try {
            const friends = await getFriendsListApi();
            setFriendsList(friends);
        } catch (error) { console.error("Erreur amis", error); }
    };

    const showGroupsMode = async () => {
        setViewMode('groups');
        setIsLoading(true);
        try {
            const groups = await getUserGroupsApi();
            setGroupsList(groups);
        } catch (error) { console.error("Erreur groupes", error); } finally { setIsLoading(false); }
    };

    const handleCreateGroup = async () => {
        const groupName = prompt("Nom du groupe :");
        if (!groupName || !groupName.trim()) return;
        try {
            await createGroupApi(groupName);
            alert("Groupe créé !");
            setShowAddFriendMenu(false);
            showGroupsMode();
        } catch (error) { alert("Erreur création groupe"); }
    };

    const handleGroupClick = (group: Group) => {
        setSelectedGroup(group);
        setSelectedFriend(null);
        setShowAddMemberModal(false);
    };

    const handleAddMember = async (friendId: string, friendName: string) => {
        if (!selectedGroup) return;
        try {
            await addMemberToGroupApi(selectedGroup.id, friendId);
            alert(`${friendName} a été ajouté au groupe !`);
            setShowAddMemberModal(false);
            showGroupsMode();
        } catch (error: any) {
            alert(error.response?.data?.error || "Erreur lors de l'ajout");
        }
    };

    const startSearchMode = async () => {
        setShowAddFriendMenu(false);
        setViewMode('search');
        setSearchQuery('');
        setSearchResults([]);
        setIsLoading(true);
        try {
            const users = await getAllUsersService();
            if (Array.isArray(users)) setAllUsersList(users);
        } catch (error) { }
        finally { setIsLoading(false); }
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim() === '') setSearchResults([]);
        else setSearchResults(allUsersList.filter(u => u.username.toLowerCase().includes(query.toLowerCase())));
    };

    const handleSendRequest = async (id: string, name: string) => {
        try {
            await sendFriendRequestApi(id);
            alert(`Demande envoyée à ${name}`);
        } catch (e: any) {
            alert(e.response?.data?.error);
        }
    };

    const showRequestsMode = async () => {
        setViewMode('requests');
        setIsLoading(true);
        try {
            const reqs = await getReceivedRequestsApi();
            setReceivedRequests(reqs);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const handleAccept = async (id: string, name: string) => {
        try {
            await acceptFriendRequestApi(id);
            alert(`${name} est ami !`);
            setReceivedRequests(p => p.filter(r => r.senderId !== id));
            fetchFriends();
        } catch (e) { console.error(e); }
    };

    const handleRefuse = async (id: string) => {
        if (!confirm("Refuser ?")) return;
        try {
            await refuseFriendRequestApi(id);
            setReceivedRequests(p => p.filter(r => r.senderId !== id));
        } catch (e) { console.error(e); }
    };

    const closeSpecialMode = () => {
        setViewMode('default');
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleFriendClick = (friend: User) => {
        setSelectedFriend(friend);
        setSelectedGroup(null);
    };

    const availableFriends = selectedGroup
        ? friendsList.filter(friend => !selectedGroup.members.some(m => String(m.userId) === String(friend.id)))
        : [];

    return (
        <div className="home-container">
            <aside className="sidebar">
                {(viewMode === 'default' || viewMode === 'groups') ? (
                    <header className="sidebar-header">
                        <div className="header-icons">
                            <button
                                className={`icon-btn ${viewMode === 'default' ? 'icon-btn-active' : ''}`}
                                onClick={() => setViewMode('default')}
                                title="Amis"
                            >
                                <span className="icon">👤</span>
                            </button>
                            <button
                                className={`icon-btn ${viewMode === 'groups' ? 'icon-btn-active' : ''}`}
                                onClick={showGroupsMode}
                                title="Groupes"
                            >
                                <span className="icon">👥</span>
                            </button>
                            <button
                                className="icon-btn"
                                onClick={showRequestsMode}
                                title="Demandes"
                            >
                                <span className="icon">📩</span>
                            </button>
                            {/* On déplace les événements sur le conteneur parent */}
                            <div
                                className="dropdown-container"
                                onMouseEnter={() => setShowAddFriendMenu(true)}
                                onMouseLeave={() => setShowAddFriendMenu(false)}
                            >
                                {/* Le bouton "+" ne doit PLUS avoir de onMouseEnter/Leave */}
                                <button className="icon-btn icon-btn-add" title="Ajouter">
                                    <span className="icon">+</span>
                                </button>

                                {/* Le menu ne doit PLUS avoir de onMouseEnter/Leave */}
                                {showAddFriendMenu && (
                                    <div className="dropdown-menu">
                                        <button className="dropdown-item" onClick={startSearchMode}>
                                            <span className="dropdown-icon">👤</span> Ajouter une personne
                                        </button>
                                        <button className="dropdown-item" onClick={handleCreateGroup}>
                                            <span className="dropdown-icon">👥</span> Créer un groupe
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                ) : (
                    <header className="sidebar-header search-header">
                        <button className="back-btn" onClick={closeSpecialMode} title="Retour">
                            <span className="back-icon">←</span>
                        </button>
                        {viewMode === 'search' ? (
                            <div className="search-container">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Rechercher des utilisateurs..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <h3 className="requests-title">Demandes d'ami</h3>
                        )}
                    </header>
                )}

                <div className="contacts-list">
                    {viewMode === 'search' && !isLoading && searchResults.map(u => (
                        <div key={u.id} className="contact-item">
                            <div className="contact-avatar">
                                {u.username[0].toUpperCase()}
                            </div>
                            <div className="contact-info">
                                <span className="contact-name">{u.username}</span>
                            </div>
                            <button
                                className="add-btn"
                                onClick={() => handleSendRequest(String(u.id), u.username)}
                                title="Envoyer une demande"
                            >
                                +
                            </button>
                        </div>
                    ))}

                    {viewMode === 'requests' && !isLoading && receivedRequests.map(r => (
                        <div key={r.senderId} className="contact-item">
                            <div className="contact-avatar contact-avatar-purple">
                                {r.sender.username[0].toUpperCase()}
                            </div>
                            <div className="contact-info">
                                <span className="contact-name">{r.sender.username}</span>
                            </div>
                            <div className="request-actions">
                                <button
                                    className="accept-btn"
                                    onClick={() => handleAccept(r.senderId, r.sender.username)}
                                    title="Accepter"
                                >
                                    ✓
                                </button>
                                <button
                                    className="refuse-btn"
                                    onClick={() => handleRefuse(r.senderId)}
                                    title="Refuser"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}

                    {viewMode === 'default' && friendsList.map(f => (
                        <div
                            key={f.id}
                            className={`contact-item ${selectedFriend?.id === f.id ? 'contact-item-active' : ''}`}
                            onClick={() => handleFriendClick(f)}
                        >
                            <div className="contact-avatar">
                                {f.username[0].toUpperCase()}
                            </div>
                            <div className="contact-info">
                                <span className="contact-name">{f.username}</span>
                            </div>
                        </div>
                    ))}

                    {viewMode === 'groups' && groupsList.map(g => (
                        <div
                            key={g.id}
                            className={`contact-item ${selectedGroup?.id === g.id ? 'contact-item-active' : ''}`}
                            onClick={() => handleGroupClick(g)}
                        >
                            <div className="contact-avatar contact-avatar-group">
                                {g.name[0].toUpperCase()}
                            </div>
                            <div className="contact-info">
                                <span className="contact-name">{g.name}</span>
                                <span className="contact-meta">{g.members.length} membres</span>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            <main className="chat-main">
                {selectedFriend ? (
                    <div className="chat-container">
                        <header className="chat-header">
                            <div className="chat-header-content">
                                <div className="chat-avatar chat-avatar-friend">{selectedFriend.username[0].toUpperCase()}</div>
                                <div className="chat-info"><h3 className="chat-title">{selectedFriend.username}</h3><span className="chat-status">Discussion privée</span></div>
                            </div>
                        </header>

                        {/* LISTE DES MESSAGES */}
                        <div className="messages-area">
                            {messages.length === 0 ? (
                                <div className="empty-messages"><p>Aucun message. Dites bonjour ! 👋</p></div>
                            ) : (
                                messages.map(msg => {
                                    const isMe = String(msg.authorId) === String(currentUserId);
                                    return (
                                        <div key={msg.id} className={`message-bubble ${isMe ? 'message-self' : 'message-other'}`}>
                                            {!isMe && <div className="message-author">{msg.author.username}</div>}
                                            <div className="message-text">{msg.content}</div>
                                            <div className="message-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="message-input-container">
                            <input
                                className="message-input"
                                placeholder="Écrire un message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="send-btn" onClick={handleSendMessage}>Envoyer</button>
                        </div>
                    </div>
                ) : selectedGroup ? (
                    <div className="chat-container">
                        <header className="chat-header chat-header-group">
                            <div className="chat-header-content">
                                <div className="chat-avatar chat-avatar-group">{selectedGroup.name[0].toUpperCase()}</div>
                                <div className="chat-info"><h3 className="chat-title">{selectedGroup.name}</h3><span className="chat-meta">{selectedGroup.members.length} membres</span></div>
                            </div>
                            <button className="add-member-btn" onClick={() => setShowAddMemberModal(true)}><span className="add-icon">+</span> Ajouter un membre</button>
                        </header>

                        <div className="messages-area">
                            {messages.length === 0 ? (
                                <div className="empty-messages"><p>Bienvenue dans le groupe {selectedGroup.name}.</p></div>
                            ) : (
                                messages.map(msg => {
                                    const isMe = String(msg.authorId) === String(currentUserId);
                                    return (
                                        <div key={msg.id} className={`message-bubble ${isMe ? 'message-self' : 'message-other'}`}>
                                            {!isMe && <div className="message-author">{msg.author.username}</div>}
                                            <div className="message-text">{msg.content}</div>
                                            <div className="message-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="message-input-container">
                            <input
                                className="message-input"
                                placeholder="Message au groupe..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="send-btn" onClick={handleSendMessage}>Envoyer</button>
                        </div>

                        {showAddMemberModal && (
                            <div className="modal-overlay">
                                <div className="modal">
                                    <div className="modal-header"><h3>Ajouter un membre</h3><button className="modal-close" onClick={() => setShowAddMemberModal(false)}>×</button></div>
                                    <div className="modal-body">
                                        <p className="modal-subtitle">Ajouter un ami à "{selectedGroup.name}"</p>
                                        <div className="friends-list-modal">
                                            {availableFriends.length === 0 ? (<p className="no-friends">Aucun ami disponible.</p>) : (availableFriends.map(friend => (<div key={friend.id} className="friend-item-modal"><div className="friend-avatar-modal">{friend.username[0].toUpperCase()}</div><span className="friend-name-modal">{friend.username}</span><button className="add-friend-btn-modal" onClick={() => handleAddMember(String(friend.id), friend.username)}>Ajouter</button></div>)))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="empty-chat">
                        <div className="empty-chat-content"><div className="empty-chat-icon">💬</div><h2>Messagerie</h2><p>Sélectionnez une conversation</p></div>
                    </div>
                )}
            </main>
        </div>
    );
}