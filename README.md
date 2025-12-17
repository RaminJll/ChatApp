# AppChat - Application de Messagerie Instantanée

Une application web de messagerie instantanée, développée avec une stack moderne et conteneurisée avec Docker.

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
- **Socket.IO**
- **Prisma**
- **PostgreSQL**

### Frontend

- **React** en **TypeScript**
- **Socket.IO Client**
- **Tailwind css**

### DevOps

- **Docker** & **Docker Compose**
- **PostgreSQL**

---

## 🚀 Lancement

### Prérequis

- Docker et Docker Compose installés
- Git

### 1. Cloner le projet

```bash
git clone https://github.com/RaminJll/ChatApp.git
```

### 2. Créer le fichier .env
```bash
cp server/.env.example server/.env
```

### 3. Lancer Docker
```bash
docker-compose up --build
```

---

### Accès à l'application

- **Application Web** : http://localhost:5173
- **API Backend** : http://localhost:3000

### Utilisateurs de test

- **Emails** : user1@example.com à user10@example.com
- **Mot de passe** : password123.