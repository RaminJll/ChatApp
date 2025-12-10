import { useState, useEffect, type ChangeEvent } from 'react';
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

import './HomePage.css';

export default function HomePage() {
    // --- ÉTATS D'AFFICHAGE ---
    const [viewMode, setViewMode] = useState<'default' | 'search' | 'requests'>('default');
    const [showAddFriendMenu, setShowAddFriendMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // --- ÉTATS DE DONNÉES ---
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsersList, setAllUsersList] = useState<User[]>([]); // Pour la recherche
    const [searchResults, setSearchResults] = useState<User[]>([]); // Résultats filtrés
    const [receivedRequests, setReceivedRequests] = useState<ReceivedRequest[]>([]); // Demandes reçues
    const [friendsList, setFriendsList] = useState<User[]>([]); // Liste d'amis confirmés

    // --- ÉTAT DE LA CONVERSATION ACTIVE ---
    // On stocke l'ami avec qui on discute actuellement (null si aucun sélectionné)
    const [selectedFriend, setSelectedFriend] = useState<User | null>(null);

    // Chargement initial des amis
    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const friends = await getFriendsListApi();
            console.log(friends);
            setFriendsList(friends);
        } catch (error) {
            console.error("Erreur chargement amis", error);
        }
    };

    // --- GESTION RECHERCHE ---
    const startSearchMode = async () => {
        setShowAddFriendMenu(false);
        setViewMode('search');
        setSearchQuery('');
        setSearchResults([]);
        setIsLoading(true);
        try {
            const users = await getAllUsersService();
            if (Array.isArray(users)) setAllUsersList(users);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
        } else {
            const results = allUsersList.filter(user =>
                user.username.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
        }
    };

    const handleSendRequest = async (userIdToAdd: string, username: string) => {
        try {
            await sendFriendRequestApi(userIdToAdd);
            alert(`Demande d'ami envoyée à ${username} !`);
        } catch (error: any) {
            const msg = error.response?.data?.error || "Erreur lors de l'envoi";
            alert(msg);
        }
    };

    // --- GESTION DEMANDES REÇUES ---
    const showRequestsMode = async () => {
        setViewMode('requests');
        setIsLoading(true);
        try {
            const requests = await getReceivedRequestsApi();
            setReceivedRequests(requests);
        } catch (error) {
            console.error("Erreur chargement demandes", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = async (senderId: string, username: string) => {
        try {
            await acceptFriendRequestApi(senderId);
            alert(`${username} est maintenant votre ami !`);
            setReceivedRequests(prev => prev.filter(req => req.senderId !== senderId));
            fetchFriends(); // Recharger la liste d'amis
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'acceptation.");
        }
    };

    const handleRefuse = async (senderId: string) => {
        if (!confirm("Voulez-vous refuser cette demande ?")) return;
        try {
            await refuseFriendRequestApi(senderId);
            setReceivedRequests(prev => prev.filter(req => req.senderId !== senderId));
        } catch (error) {
            console.error(error);
            alert("Erreur lors du refus.");
        }
    };

    // --- NAVIGATION ---
    const closeSpecialMode = () => {
        setViewMode('default');
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleFriendClick = (friend: User) => {
        setSelectedFriend(friend);
        // TODO: Ici, on déclenchera plus tard le chargement des messages réels
    };

    return (
        <div className="chat-layout">
            <aside className="chat-sidebar">
                
                {/* --- HEADER --- */}
                {viewMode === 'default' ? (
                    <header className="sidebar-header icons-bar">
                        <div className="icon-item" title="Demandes reçues" onClick={showRequestsMode}>📩</div>
                        <div className="icon-item" title="Discussions">💬</div>
                        <div className="icon-item" title="Groupes">👥</div>
                        <div className="icon-item-dropdown" onMouseEnter={() => setShowAddFriendMenu(true)} onMouseLeave={() => setShowAddFriendMenu(false)}>
                            <div className="icon-item" title="Ajouter">➕</div>
                            {showAddFriendMenu && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-item" onClick={startSearchMode}>Ajouter une personne</div>
                                    <div className="dropdown-item">Créer un groupe</div>
                                </div>
                            )}
                        </div>
                    </header>
                ) : (
                    <header className="sidebar-header search-mode">
                        <button className="back-btn" onClick={closeSpecialMode}>🔙</button>
                        {viewMode === 'search' ? (
                            <input
                                type="text"
                                className="search-friend-input"
                                placeholder="Rechercher un pseudo..."
                                value={searchQuery}
                                onChange={handleSearch}
                                autoFocus
                            />
                        ) : (
                            <h4 style={{margin: 0, color: '#555'}}>Demandes reçues</h4>
                        )}
                    </header>
                )}

                {/* --- LISTE --- */}
                <div className="discussion-list">

                    {/* MODE RECHERCHE */}
                    {viewMode === 'search' && (
                        <>
                            {!isLoading && searchResults.map(user => (
                                <div key={user.id} className="discussion-item">
                                    <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
                                    <div className="info">
                                        <p className="contact-name">{user.username}</p>
                                        <small className="last-message">Cliquez pour ajouter</small>
                                    </div>
                                    <button
                                        style={{ border: 'none', background: 'transparent', color: '#3498db', cursor: 'pointer', fontSize: '1.2rem' }}
                                        onClick={() => handleSendRequest(String(user.id), user.username)}
                                    >
                                        +
                                    </button>
                                </div>
                            ))}
                        </>
                    )}

                    {/* MODE DEMANDES REÇUES */}
                    {viewMode === 'requests' && (
                        <>
                            {isLoading && <div style={{padding: 20}}>Chargement...</div>}
                            {!isLoading && receivedRequests.length === 0 && (
                                <div style={{padding: 20, color: '#888', textAlign: 'center'}}>Aucune demande.</div>
                            )}
                            {!isLoading && receivedRequests.map(req => (
                                <div key={req.senderId} className="discussion-item">
                                    <div className="avatar" style={{backgroundColor: '#9b59b6'}}>{req.sender.username.charAt(0).toUpperCase()}</div>
                                    <div className="info">
                                        <p className="contact-name">{req.sender.username}</p>
                                        <small className="last-message">Veut être votre ami</small>
                                    </div>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <button onClick={() => handleAccept(req.senderId, req.sender.username)} style={{border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem'}}>✅</button>
                                        <button onClick={() => handleRefuse(req.senderId)} style={{border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem'}}>❌</button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* MODE PAR DÉFAUT : LISTE D'AMIS */}
                    {viewMode === 'default' && (
                        <>
                            {friendsList.length === 0 ? (
                                <div style={{padding: 20, textAlign: 'center', color: '#888'}}>
                                    Vous n'avez pas encore d'amis.<br/>
                                    Ajoutez-en via le menu ➕ !
                                </div>
                            ) : (
                                friendsList.map(friend => (
                                    <div 
                                        key={friend.id} 
                                        className={`discussion-item ${selectedFriend?.id === friend.id ? 'active' : ''}`}
                                        onClick={() => handleFriendClick(friend)}
                                    >
                                        <div className="avatar" style={{backgroundColor: '#3498db'}}>
                                            {friend.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="info">
                                            <p className="contact-name">{friend.username}</p>
                                            <small className="last-message">Appuyez pour discuter</small>
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    )}
                </div>
            </aside>

            {/* --- ZONE DE CHAT PRINCIPALE --- */}
            <main className="chat-area">
                {selectedFriend ? (
                    <>
                        <header className="chat-header">
                            <h4>{selectedFriend.username}</h4>
                        </header>
                        
                        <div className="messages-container">
                            {/* C'est ici qu'on affichera la vraie liste des messages plus tard */}
                            <div style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>
                                Début de la conversation avec {selectedFriend.username}.<br/>
                                (Les messages ne sont pas encore chargés depuis le backend)
                            </div>
                        </div>

                        <div className="input-area">
                            <input type="text" className="chat-input" placeholder="Écrire..." />
                            <button className="send-button">Envoyer</button>
                        </div>
                    </>
                ) : (
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa'}}>
                        <h3>Sélectionnez un ami pour commencer à discuter</h3>
                    </div>
                )}
            </main>
        </div>
    );
}