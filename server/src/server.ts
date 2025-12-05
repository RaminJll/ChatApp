// src/server.ts
import app from './app';

const PORT = process.env.PORT || 3000;

// Démarre l'écoute de l'application
app.listen(PORT, () => {
  console.log(`Express est en cours d'exécution sur le port http://localhost:${PORT}`);
});