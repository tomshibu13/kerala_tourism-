import express from 'express';
import { 
  getReviews, getFlaggedReviews, approveReview, rejectReview, deleteReview 
} from '../../controllers/adminReviewController.js';
import { admin } from '../../middleware/adminMiddleware.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.route('/')
  .get(getReviews);

router.get('/flagged', getFlaggedReviews);

router.patch('/:id/approve', approveReview);
router.patch('/:id/reject', rejectReview);

router.route('/:id')
  .delete(deleteReview);

export default router;
