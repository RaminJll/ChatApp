// src/pages/HomePage.tsx
import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { io, Socket } from 'socket.io-client';

// Services
import { getAllUsersService } from '../services/usersService';
import {sendFriendRequestApi, getReceivedRequestsApi, acceptFriendRequestApi, refuseFriendRequestApi, getFriendsListApi} from '../services/friendsService';
import {createGroupApi, getUserGroupsApi, addMemberToGroupApi} from '../services/groupsService';
import {getDirectMessagesApi, sendDirectMessageApi, getGroupMessagesApi, sendGroupMessageApi} from '../services/messagesService';

// Types
import type { User } from '../types/userType';
import type { ReceivedRequest } from '../types/friendsType';
import type { Group } from '../types/groupsType';
import type { Message } from '../types/messagesType';
import { useNavigate } from 'react-router-dom';


export default function HomePage() {
    const navigate = useNavigate();

    // View Mode 
    const [viewMode, setViewMode] = useState<'default' | 'search' | 'requests' | 'groups'>('default');

    const [showAddFriendMenu, setShowAddFriendMenu] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    // Data States
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsersList, setAllUsersList] = useState<User[]>([]);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [receivedRequests, setReceivedRequests] = useState<ReceivedRequest[]>([]);
    const [friendsList, setFriendsList] = useState<User[]>([]);
    const [groupsList, setGroupsList] = useState<Group[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);

    // Selection States
    const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    // Refs & Socket
    const [socket, setSocket] = useState<Socket | null>(null);

    // User Info
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser.id || '';

    // Deconnexion
    const handleLogout = () => {
        if (socket) {
            socket.disconnect();
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        navigate('/connexion');
    };

    useEffect(() => {
        const newSocket = io('http://localhost:3000', {
            auth: { token: localStorage.getItem('token') }
        });
        setSocket(newSocket);

        if (currentUserId) {
            newSocket.emit('join_user_room', currentUserId);
        }

        return () => { newSocket.disconnect(); };
    }, [currentUserId]);

    // Rejoindre la room du groupe quand on le sélectionne
    useEffect(() => {
        if (socket && selectedGroup) {
            socket.emit('join_group_room', selectedGroup.id);
        }
    }, [selectedGroup, socket]);

    // Réception des messages en temps réel
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMessage: Message) => {
            // Cas 1 : Message dans le groupe ouvert
            const isForCurrentGroup = selectedGroup && newMessage.groupId === selectedGroup.id;

            // Cas 2 : Message privé avec l'ami ouvert
            const isForCurrentFriend = selectedFriend && (
                (newMessage.authorId === String(selectedFriend.id) && !newMessage.groupId) ||
                (newMessage.authorId === currentUserId && !newMessage.groupId)
            );

            if (isForCurrentGroup || isForCurrentFriend) {
                setMessages((prevMessages) => {
                    const newMessagesArray = [...prevMessages];
                    newMessagesArray.push(newMessage);
                    return newMessagesArray;
                });
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        return () => { socket.off('receive_message', handleReceiveMessage); };
    }, [socket, selectedGroup, selectedFriend, currentUserId]);

    // Charger l'historique quand on change de sélection
    useEffect(() => {
        if (selectedFriend) {
            loadDirectMessages(String(selectedFriend.id));
        } else if (selectedGroup) {
            loadGroupMessages(selectedGroup.id);
        }
    }, [selectedFriend, selectedGroup]);

    // charger l'historique des messages privés
    const loadDirectMessages = async (friendId: string) => {
        try {
            const msgs = await getDirectMessagesApi(friendId);
            setMessages(msgs);
        } catch (error) { 
            console.error(error); 
        }
    };

    // charger l'historique des messages de groupe
    const loadGroupMessages = async (groupId: string) => {
        try {
            const msgs = await getGroupMessagesApi(groupId);
            setMessages(msgs);
        } catch (error) { console.error(error); }
    };

    // Gerer l'envoi de message
    const handleSendMessage = async () => {
        if (!messageInput.trim()) return;
        try {
            if (selectedFriend) {
                await sendDirectMessageApi(String(selectedFriend.id), messageInput);
            } else if (selectedGroup) {
                await sendGroupMessageApi(selectedGroup.id, messageInput);
            }
            setMessageInput('');
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'envoi");
        }
    };

    // Afficher le mode groupes
    const showGroupsMode = async () => {
        setViewMode('groups');
        try {
            const groups = await getUserGroupsApi();
            setGroupsList(groups);
        } catch (error) {
            console.error(error);
        }
    };

    // Créer un nouveau groupe
    const handleCreateGroup = async () => {
        const groupName = prompt("Nom du nouveau groupe :");
        if (!groupName?.trim()) return;

        try {
            await createGroupApi(groupName);
            alert("Groupe créé avec succès !");
            setShowAddFriendMenu(false);
            showGroupsMode();
        } catch (error) {
            alert("Erreur lors de la création du groupe");
        }
    };

    // Gérer le clic sur un groupe
    const handleGroupClick = (group: Group) => {
        setSelectedGroup(group);
        setSelectedFriend(null);
        setShowAddMemberModal(false);
    };

    // Ajouter un membre au groupe
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

    // Charger la liste des amis
    const fetchFriends = async () => {
        try {
            setFriendsList(await getFriendsListApi());
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    // Démarrer le mode recherche
    const startSearchMode = async () => {
        setShowAddFriendMenu(false);
        setViewMode('search');
        setSearchQuery('');
        setSearchResults([]);
        try {
            const users = await getAllUsersService();
            setAllUsersList(users || []);
        } catch (error) {
            console.error(error);
        }
    };

    // Gestion de la recherche
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
        } else {
            setSearchResults(allUsersList.filter(u => u.username.toLowerCase().includes(query.toLowerCase())));
        }
    };

    // Gestion des demandes d'ami
    const handleSendRequest = async (id: string, name: string) => {
        try {
            await sendFriendRequestApi(id); alert(`Demande envoyée à ${name}`);
        }
        catch (e: any) {
            alert(e.response?.data?.error);
        }
    };

    // Afficher les demandes d'ami reçues
    const showRequestsMode = async () => {
        setViewMode('requests');
        try {
            setReceivedRequests(await getReceivedRequestsApi());
        }
        catch (e) {
            console.error(e);
        }
    };

    // Accepter une demande
    const handleAccept = async (id: string, name: string) => {
        try {
            await acceptFriendRequestApi(id);
            alert(`${name} est désormais votre ami !`);
            setReceivedRequests(p => p.filter(r => r.senderId !== id));
            fetchFriends();
        } catch (e) {
            console.error(e);
        }
    };

    // Refuser une demande
    const handleRefuse = async (id: string) => {
        if (!confirm("Refuser cette demande ?")) return;
        try {
            await refuseFriendRequestApi(id);
            setReceivedRequests(p => p.filter(r => r.senderId !== id));
        } catch (e) { console.error(e); }
    };

    // Sélectionner un ami
    const handleFriendClick = (friend: User) => {
        setSelectedFriend(friend);
        setSelectedGroup(null);
    };

    // Fermer le mode recherche
    const closeSpecialMode = () => {
        setViewMode('default');
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    console.log(fetchFriends);


    // Calcul des amis disponibles pour ajout au groupe (ceux qui ne sont pas déjà dedans)
    const availableFriends = selectedGroup
        ? friendsList.filter(friend => !selectedGroup.members.some(m => String(m.userId) === String(friend.id)))
        : [];

    // STYLES UTILS
    const iconBtnClass = "w-10 h-10 border-none rounded-xl cursor-pointer flex items-center justify-center text-slate-500 text-lg transition-all hover:bg-blue-500 hover:text-white hover:-translate-y-px hover:shadow-md";
    const activeIconBtnClass = "bg-blue-500 text-white shadow-md";
    const contactItemClass = "flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all mb-2 border border-transparent hover:bg-slate-100 hover:border-slate-200";
    const activeContactItemClass = "bg-blue-50 border-l-[3px] border-l-blue-500";

    return (
        <div className="grid grid-cols-[280px_1fr] h-screen bg-slate-50 font-sans">

            {/* SIDEBAR */}
            <aside className="bg-white border-r border-slate-200 flex flex-col shadow-sm z-50">
                {(viewMode === 'default' || viewMode === 'groups') ? (
                    <header className="p-5 border-b border-slate-200">
                        <div className="grid grid-cols-4 gap-3">
                            <button
                                className={`${iconBtnClass} ${viewMode === 'default' ? activeIconBtnClass : 'bg-slate-100'}`}
                                onClick={() => setViewMode('default')}
                                title="Mes Amis"
                            >
                                👤
                            </button>
                            <button
                                className={`${iconBtnClass} ${viewMode === 'groups' ? activeIconBtnClass : 'bg-slate-100'}`}
                                onClick={showGroupsMode}
                                title="Mes Groupes"
                            >
                                👥
                            </button>
                            <button
                                className={`${iconBtnClass} bg-slate-100`}
                                onClick={showRequestsMode}
                                title="Demandes d'amis"
                            >
                                📩
                            </button>

                            {/* BULLE D'AJOUTS */}
                            <div
                                className="relative"
                                onMouseEnter={() => setShowAddFriendMenu(true)}
                                onMouseLeave={() => setShowAddFriendMenu(false)}
                            >
                                <button className={`${iconBtnClass} bg-blue-500 text-white hover:bg-blue-600`} title="Nouveau...">
                                    +
                                </button>

                                {showAddFriendMenu && (
                                    <div className="absolute top-full w-48 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                                        <button className="w-full p-3 text-left bg-transparent border-none rounded-lg cursor-pointer text-slate-700 text-sm hover:bg-slate-100 flex items-center gap-3" onClick={startSearchMode}>
                                            <span>👤</span> Ajouter un ami
                                        </button>
                                        <button className="w-full p-3 text-left bg-transparent border-none rounded-lg cursor-pointer text-slate-700 text-sm hover:bg-slate-100 flex items-center gap-3" onClick={handleCreateGroup}>
                                            <span>👥</span> Créer un groupe
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                ) : (
                    <header className="p-5 border-b border-slate-200 flex items-center gap-3">
                        <button className="w-9 h-9 border-none bg-slate-100 rounded-full cursor-pointer flex items-center justify-center text-slate-500 hover:bg-blue-500 hover:text-white transition-all" onClick={closeSpecialMode} title="Retour">
                            ←
                        </button>
                        {viewMode === 'search' ? (
                            <div className="flex-1">
                                <input
                                    type="text"
                                    className="w-full p-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    placeholder="Rechercher..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <h3 className="text-lg font-semibold text-slate-800 m-0">Demandes d'ami</h3>
                        )}
                    </header>
                )}

                {/* Liste des contacts */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    {/* RESULTATS RECHERCHE */}
                    {viewMode === 'search' && searchResults.map(u => (
                        <div key={u.id} className={contactItemClass}>
                            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                                {u.username[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <span className="font-medium text-slate-800 text-sm">{u.username}</span>
                            </div>
                            <button
                                className="w-8 h-8 border-none bg-emerald-500 text-white rounded-lg cursor-pointer font-bold hover:bg-emerald-600 hover:scale-105 transition-all"
                                onClick={() => handleSendRequest(String(u.id), u.username)}
                            >
                                +
                            </button>
                        </div>
                    ))}

                    {/* DEMANDES REÇUES */}
                    {viewMode === 'requests' && receivedRequests.map(r => (
                        <div key={r.senderId} className={contactItemClass}>
                            <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold text-lg">
                                {r.sender.username[0].toUpperCase()}
                            </div>
                            <div className="flex-1 flex flex-col">
                                <span className="font-medium text-slate-800 text-sm">{r.sender.username}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 border-none rounded-lg cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 transition-all" onClick={() => handleAccept(r.senderId, r.sender.username)}>✓</button>
                                <button className="w-8 h-8 border-none rounded-lg cursor-pointer bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-all" onClick={() => handleRefuse(r.senderId)}>×</button>
                            </div>
                        </div>
                    ))}

                    {/* LISTE AMIS */}
                    {viewMode === 'default' && friendsList.map(f => (
                        <div
                            key={f.id}
                            className={`${contactItemClass} ${selectedFriend?.id === f.id ? activeContactItemClass : ''}`}
                            onClick={() => handleFriendClick(f)}
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                                {f.username[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <span className="font-medium text-slate-800 text-sm">{f.username}</span>
                            </div>
                        </div>
                    ))}

                    {/* LISTE GROUPES */}
                    {viewMode === 'groups' && groupsList.map(g => (
                        <div
                            key={g.id}
                            className={`${contactItemClass} ${selectedGroup?.id === g.id ? activeContactItemClass : ''}`}
                            onClick={() => handleGroupClick(g)}
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg">
                                {g.name[0].toUpperCase()}
                            </div>
                            <div className="flex-1 flex flex-col">
                                <span className="font-medium text-slate-800 text-sm">{g.name}</span>
                                <span className="text-xs text-slate-500">{g.members.length} membres</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-200">
                    <button
                        onClick={handleLogout}
                        className="w-full p-3 flex items-center gap-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-all border-none cursor-pointer"
                    >
                        <span>🚪</span> Déconnexion
                    </button>
                </div>
            </aside>

            {/* CHAT MAIN */}
            <main className="bg-white flex flex-col h-full relative">

                {/* VUE AMI SÉLECTIONNÉ */}
                {selectedFriend ? (
                    <div className="flex-1 flex flex-col h-full">
                        <header className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                                    {selectedFriend.username[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">{selectedFriend.username}</h3>
                                    <span className="text-xs text-emerald-500 font-medium">Discussion privée</span>
                                </div>
                            </div>
                        </header>

                        <div className="flex-1 p-6 overflow-y-auto bg-slate-50 relative scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            {messages.map(msg => {
                                const isMe = String(msg.authorId) === String(currentUserId);
                                return (
                                    <div key={msg.id} className={`max-w-[70%] mb-3 p-3 rounded-2xl relative text-sm leading-relaxed break-words z-10 ${isMe
                                        ? 'self-end ml-auto bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm'
                                        : 'self-start mr-auto bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-100'
                                        }`}>
                                        <div className="mb-1">{msg.content}</div>
                                        <div className={`text-[10px] text-right ${isMe ? 'opacity-70' : 'text-slate-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                            <div/>
                        </div>

                        <div className="p-5 border-t border-slate-200 bg-white flex gap-3">
                            <input
                                className="flex-1 p-3.5 px-5 border-2 border-slate-200 rounded-2xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="Écrire un message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="px-6 bg-blue-500 text-white border-none rounded-2xl font-medium text-sm cursor-pointer hover:bg-blue-600 hover:-translate-y-px hover:shadow-lg transition-all" onClick={handleSendMessage}>
                                Envoyer
                            </button>
                        </div>
                    </div>

                ) : selectedGroup ? (
                    <div className="flex-1 flex flex-col h-full">
                        <header className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg">
                                    {selectedGroup.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800">{selectedGroup.name}</h3>
                                    <span className="text-xs text-slate-500">{selectedGroup.members.length} membres : </span>
                                    <span className="text-xs text-slate-500 truncate">
                                        {selectedGroup.members?.map(m => m.user?.username).join(', ')}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="px-5 py-2.5 bg-blue-500 text-white border-none rounded-xl cursor-pointer text-sm font-medium flex items-center gap-2 hover:bg-blue-600 hover:-translate-y-px hover:shadow-lg transition-all"
                                onClick={() => setShowAddMemberModal(true)}
                            >
                                <span>+</span> Ajouter un membre
                            </button>
                        </header>

                        <div className="flex-1 p-6 overflow-y-auto bg-slate-50 relative scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            {messages.length === 0 ? (
                                <div className="text-center text-slate-400 text-sm py-10 relative z-10"><p>Bienvenue dans le groupe {selectedGroup.name}.</p></div>
                            ) : (
                                messages.map(msg => {
                                    const isMe = String(msg.authorId) === String(currentUserId);
                                    return (
                                        <div key={msg.id} className={`max-w-[70%] mb-3 p-3 rounded-2xl relative text-sm leading-relaxed break-words z-10 ${isMe
                                            ? 'self-end ml-auto bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm'
                                            : 'self-start mr-auto bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-100'
                                            }`}>
                                            {!isMe && <div className="text-[11px] font-bold mb-1 text-indigo-500">{msg.author.username}</div>}
                                            <div className="mb-1">{msg.content}</div>
                                            <div className={`text-[10px] text-right ${isMe ? 'opacity-70' : 'text-slate-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div/>
                        </div>

                        <div className="p-5 border-t border-slate-200 bg-white flex gap-3">
                            <input
                                className="flex-1 p-3.5 px-5 border-2 border-slate-200 rounded-2xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="Message au groupe..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="px-6 bg-blue-500 text-white border-none rounded-2xl font-medium text-sm cursor-pointer hover:bg-blue-600 hover:-translate-y-px hover:shadow-lg transition-all" onClick={handleSendMessage}>
                                Envoyer
                            </button>
                        </div>

                        {/* AJOUT MEMBRE */}
                        {showAddMemberModal && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
                                <div className="bg-white rounded-2xl w-[90%] max-w-[500px] shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-slate-800 m-0">Ajouter un membre</h3>
                                        <button className="w-8 h-8 border-none bg-slate-100 rounded-lg cursor-pointer text-slate-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center" onClick={() => setShowAddMemberModal(false)}>×</button>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-slate-500 text-sm mb-5">Ajouter un ami à "{selectedGroup.name}"</p>
                                        <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                                            {availableFriends.length === 0 ? (
                                                <p className="text-center text-slate-400 py-10 text-sm">
                                                    {friendsList.length === 0 ? "Ajoutez d'abord des amis !" : "Tous vos amis sont déjà dans ce groupe."}
                                                </p>
                                            ) : (availableFriends.map(friend => (
                                                <div key={friend.id} className="flex items-center gap-3 p-3 rounded-xl mb-2 border border-transparent hover:bg-slate-50 hover:border-slate-200 transition-all">
                                                    <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center font-medium text-sm">
                                                        {friend.username[0].toUpperCase()}
                                                    </div>
                                                    <span className="flex-1 text-sm text-slate-700 font-medium">{friend.username}</span>
                                                    <button className="px-4 py-1.5 bg-emerald-500 text-white border-none rounded-lg cursor-pointer text-xs font-medium hover:bg-emerald-600 hover:-translate-y-px transition-all" onClick={() => handleAddMember(String(friend.id), friend.username)}>
                                                        Ajouter
                                                    </button>
                                                </div>
                                            )))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-10 text-center">
                        <div className="text-6xl mb-6 text-slate-300">💬</div>
                        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Messagerie</h2>
                        <p className="text-slate-500 text-base">Sélectionnez une conversation pour commencer</p>
                    </div>
                )}
            </main>
        </div>
    );
}