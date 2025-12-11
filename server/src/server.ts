// src/server.ts
import { httpServer } from './app';

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Serveur (Express + Socket.io) en cours d'exécution sur http://localhost:${PORT}`);
});