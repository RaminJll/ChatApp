// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// On utilise une seule instance globale de PrismaClient
// pour éviter les problèmes de performance/connexions multiples.
const prisma = new PrismaClient();

export default prisma;