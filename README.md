# AppChat - Application de Messagerie Instantanée

Une application web de chat en temps réel similaire à WhatsApp, développée avec une stack moderne et conteneurisée avec Docker.

---

## Fonctionnalités

### 👤 Authentification

- **Inscription** : Création de compte utilisateur
- **Connexion** : Authentification sécurisée
- **Déconnexion** : Gestion de session

### 🤝 Gestion des Amis

- **Recherche d'utilisateurs** : Trouver d'autres utilisateurs par nom
- **Demandes d'amis** : Envoyer et recevoir des invitations
- **Liste des demandes reçues** : Accepter ou refuser les invitations
- **Liste d'amis** : Visualiser tous vos contacts

### 💬 Messagerie

- **Chat privé (1-to-1)** : Conversations privées avec vos amis
- **Groupes de discussion** : Créer des salons de groupe
- **Ajout d'amis aux groupes** : Inviter des contacts dans les groupes
- **Messagerie de groupe** : Discussions multi-utilisateurs
- **Messages en temps réel** : Via WebSockets avec Socket.IO

---

## 🛠️ Stack Technologique

### Backend

- **Node.js** avec **Express** en **TypeScript**
- **Socket.IO** pour la communication en temps réel
- **Prisma** ORM pour la base de données
- **PostgreSQL** comme base de données
- **JWT** pour l'authentification

### Frontend

- **React** en **TypeScript**
- **Socket.IO Client** pour la communication en temps réel
- **Context API** pour la gestion d'état

### DevOps

- **Docker** & **Docker Compose** pour la conteneurisation
- **PostgreSQL** conteneurisé

---

## 🚀 Lancement

### Prérequis

- Docker et Docker Compose installés
- Git

### 1. Cloner le projet

```bash
git clone https://github.com/RaminJll/ChatApp.git
```
