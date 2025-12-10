// server/src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import authRouter from './routes/auth'; 
import users from './routes/users'
import friends from './routes/friends'

const app: Application = express();

app.use(express.json());
app.use(cors()); 


app.use('/auth', authRouter); 
app.use('/users', users)
app.use('/friends', friends)

export default app;