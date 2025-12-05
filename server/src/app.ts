// server/src/app.ts
import express, { Application } from 'express';
// 1. Importer vos routeurs
import authRouter from './routes/auth'; 
import indexRouter from './routes/index';

const app: Application = express();

// Middlewares
app.use(express.json()); // Pour lire le corps des requêtes JSON
// **Optionnel mais Recommandé pour Full-Stack** :
// import cors from 'cors'; // N'oubliez pas d'installer 'cors' et '@types/cors'
// app.use(cors()); 

// 2. Définir les routes et leurs préfixes
// Toutes les routes définies dans authRouter seront précédées de /auth
app.use('/auth', authRouter); 
// Les routes d'index sont souvent à la racine (/)
app.use('/', indexRouter);

// Exportez l'application configurée
export default app;