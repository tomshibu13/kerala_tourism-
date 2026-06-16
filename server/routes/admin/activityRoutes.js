import express from 'express';
import { 
  getActivities, getActivitiesByDistrict, 
  addActivity, updateActivity, deleteActivity, toggleActivity
} from '../../controllers/adminActivityController.js';
import { admin } from '../../middleware/adminMiddleware.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.route('/')
  .get(getActivities)
  .post(addActivity);

router.get('/district/:name', getActivitiesByDistrict);

router.patch('/:id/toggle', toggleActivity);

router.route('/:id')
  .put(updateActivity)
  .delete(deleteActivity);

export default router;
