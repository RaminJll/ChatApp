// src/routes/groups.ts
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { GroupsController } from '../controllers/groupsController';

const router = Router();
const groupsController = new GroupsController();

// Créer un groupe
router.post('/create', authenticateToken, groupsController.createGroup);

// Récupérer mes groupes
router.get('/list', authenticateToken, groupsController.getMyGroups);

// Ajouter un membre (ex: via un bouton "Ajouter au groupe")
router.post('/add-member', authenticateToken, groupsController.addMember);

// Récupérer les membres d'un groupe
router.get('/members/:groupId', authenticateToken, groupsController.getGroupMembers);

export default router;