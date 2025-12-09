// server/src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import authRouter from './routes/auth'; 
import users from './routes/users'

const app: Application = express();

app.use(express.json());
app.use(cors()); 


app.use('/auth', authRouter); 
app.use('/users', users)

export default app;