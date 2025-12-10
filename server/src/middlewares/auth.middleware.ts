import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Accès refusé, Token manquant" });
  }
  
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Accès refusé, format de token invalide" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload; 

    req.userId = decoded.userId as string;

    next();
  } catch (error) {
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};