// server/src/app.ts
import * as dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io'; 
import cors from 'cors';
import authRouter from './routes/auth'; 
import users from './routes/users'
import friends from './routes/friends'
import groupsRoutes from './routes/groups';
import messagesRoutes from './routes/messages';

const app: Application = express();

// 3. Créer le serveur HTTP à partir d'Express
const httpServer = createServer(app);

// 4. Initialiser Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // L'URL de ton Front-end (Vite)
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté via Socket:', socket.id);

  // L'utilisateur rejoint une "salle" à son nom
  socket.on('join_user_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} a rejoint sa salle personnelle.`);
  });

  // L'utilisateur rejoint une salle de groupe
  socket.on('join_group_room', (groupId) => {
    socket.join(groupId);
    console.log(`Socket ${socket.id} a rejoint le groupe ${groupId}`);
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
});

app.use(express.json());
app.use(cors()); 


app.use('/auth', authRouter); 
app.use('/users', users)
app.use('/friends', friends)
app.use('/groups', groupsRoutes);
app.use('/messages', messagesRoutes);

export { app, httpServer };