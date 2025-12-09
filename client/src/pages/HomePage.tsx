// src/pages/HomePage.tsx
import { useState, type ChangeEvent } from 'react';
import { getAllUsersService } from '../services/usersService';
import type { User } from '../types/userType';
import './HomePage.css';

export default function HomePage() {
    // États d'affichage
    const [viewMode, setViewMode] = useState<'default' | 'search'>('default');
    const [showAddFriendMenu, setShowAddFriendMenu] = useState(false);
    
    // États de données
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsersList, setAllUsersList] = useState<User[]>([]); 
    const [searchResults, setSearchResults] = useState<User[]>([]);
    
    // ⬅️ NOUVEAU : État de chargement
    const [isLoading, setIsLoading] = useState(false);

    // Données fictives (Discussions actuelles)
    const discussions = [
        { id: 1, name: "Alice Dupont", lastMessage: "Super, à demain !" },
        { id: 2, name: "Bob Martin", lastMessage: "OK, je t'envoie ça." },
    ];
    
    const activeChat = {
        contactName: "Alice Dupont",
        messages: [
            { id: 1, text: "Salut !", sender: 'self' },
            { id: 2, text: "Ça va ?", sender: 'Alice' },
        ]
    };

    // 1. Déclenché quand on clique sur "Ajouter une personne"
    const startSearchMode = async () => {
        setShowAddFriendMenu(false);
        setViewMode('search');
        setSearchQuery('');
        setSearchResults([]); // Reset des résultats affichés

        // ⬅️ Début du chargement
        setIsLoading(true);

        try {
            // Appel au service (qui retourne maintenant directement User[])
            const users = await getAllUsersService();
            
            // ⚠️ Sécurité : On vérifie si c'est bien un tableau pour éviter le crash .filter()
            if (Array.isArray(users)) {
                setAllUsersList(users);
            } else {
                console.error("Format de réponse inattendu (pas un tableau):", users);
                setAllUsersList([]); 
            }
            
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs", error);
        } finally {
            // ⬅️ Fin du chargement
            setIsLoading(false);
        }
    };

    // 2. Gestion de la saisie (Filtrage local)
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setSearchResults([]);
        } else {
            // Filtrage sur la liste chargée
            const results = allUsersList.filter(user => 
                user.username.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
        }
    };

    const closeSearch = () => {
        setViewMode('default');
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <div className="chat-layout">
            <aside className="chat-sidebar">
                
                {/* --- HEADER --- */}
                {viewMode === 'default' ? (
                    <header className="sidebar-header icons-bar">
                        <div className="icon-item active" title="Discussions">💬</div>
                        <div className="icon-item" title="Groupes">👥</div>

                        <div
                            className="icon-item-dropdown"
                            onMouseEnter={() => setShowAddFriendMenu(true)}
                            onMouseLeave={() => setShowAddFriendMenu(false)}
                        >
                            <div className="icon-item" title="Ajouter">➕</div>
                            {showAddFriendMenu && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-item" onClick={startSearchMode}>
                                        Ajouter une personne
                                    </div>
                                    <div className="dropdown-item">Créer un groupe</div>
                                </div>
                            )}
                        </div>
                    </header>
                ) : (
                    <header className="sidebar-header search-mode">
                        <button className="back-btn" onClick={closeSearch}>🔙</button>
                        <input 
                            type="text" 
                            className="search-friend-input" 
                            placeholder="Rechercher un pseudo..." 
                            value={searchQuery}
                            onChange={handleSearch}
                            autoFocus
                        />
                    </header>
                )}

                {/* --- LISTE --- */}
                <div className="discussion-list">
                    {viewMode === 'search' ? (
                        <>
                            {/* Message de Chargement */}
                            {isLoading && (
                                <div style={{padding: '20px', textAlign: 'center', color: '#3498db'}}>
                                    Chargement...
                                </div>
                            )}

                            {/* Résultats (si pas en chargement) */}
                            {!isLoading && (
                                <>
                                    {searchResults.length === 0 && searchQuery !== '' && (
                                        <div style={{padding: '20px', textAlign: 'center', color: '#888'}}>
                                            Aucun utilisateur trouvé
                                        </div>
                                    )}

                                    {searchResults.map(user => (
                                        <div key={user.id} className="discussion-item">
                                            <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
                                            <div className="info">
                                                <p className="contact-name">{user.username}</p>
                                                <small className="last-message">Cliquez pour ajouter</small>
                                            </div>
                                            <button style={{border: 'none', background: 'transparent', color: '#3498db', cursor: 'pointer', fontSize: '1.2rem'}}>+</button>
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    ) : (
                        discussions.map(disc => (
                            <div key={disc.id} className={`discussion-item ${disc.id === 1 ? 'active' : ''}`}>
                                <div className="avatar">A</div>
                                <div className="info">
                                    <p className="contact-name">{disc.name}</p>
                                    <small className="last-message">{disc.lastMessage}</small>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* Zone de Chat (Inchangée) */}
            <main className="chat-area">
                <header className="chat-header"><h4>{activeChat.contactName}</h4></header>
                <div className="messages-container">
                    {activeChat.messages.map(msg => (
                        <div key={msg.id} className={`message-bubble ${msg.sender === 'self' ? 'self' : 'other'}`}>{msg.text}</div>
                    ))}
                </div>
                <div className="input-area">
                    <input type="text" className="chat-input" placeholder="Écrire..." />
                    <button className="send-button">Envoyer</button>
                </div>
            </main>
        </div>
    );
}