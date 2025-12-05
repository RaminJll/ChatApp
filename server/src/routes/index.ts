// server/src/routes/index.ts

import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/index', (req: Request, res: Response) => {
    console.log("index")
    res.status(201).json({ message: "Page d'accueil"});
})

export default router;