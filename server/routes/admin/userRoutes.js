import express from 'express';
import { 
  getUsers, getUserById, toggleUserStatus, changeUserRole, deleteUser 
} from '../../controllers/adminUserController.js';
import { admin } from '../../middleware/adminMiddleware.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.route('/')
  .get(getUsers);

router.patch('/:id/toggle', toggleUserStatus);
router.patch('/:id/role', changeUserRole);

router.route('/:id')
  .get(getUserById)
  .delete(deleteUser);

export default router;
