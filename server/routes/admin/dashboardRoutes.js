import express from 'express';
import { getDashboardStats } from '../../controllers/adminDashboardController.js';
import { admin } from '../../middleware/adminMiddleware.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getDashboardStats);

export default router;
