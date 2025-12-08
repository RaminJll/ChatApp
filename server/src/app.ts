// server/src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
// 1. Importer vos routeurs
import authRouter from './routes/auth'; 
import indexRouter from './routes/index';

const app: Application = express();

app.use(express.json());
app.use(cors()); 


app.use('/auth', authRouter); 
app.use('/', indexRouter);

export default app;