import express from 'express';
import { loginAdmin, getMe } from '../../controllers/adminAuthController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { admin } from '../../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protect, admin, getMe);

export default router;
