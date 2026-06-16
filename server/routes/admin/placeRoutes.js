import express from 'express';
import { 
  getPlaces, getPendingPlaces, getPlaceById, 
  addPlace, updatePlace, deletePlace, 
  approvePlace, rejectPlace, uploadImages 
} from '../../controllers/adminPlaceController.js';
import { admin } from '../../middleware/adminMiddleware.js';
import { protect } from '../../middleware/authMiddleware.js';
import { upload } from '../../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply auth & admin middleware to all routes
router.use(protect, admin);

router.route('/')
  .get(getPlaces)
  .post(addPlace);

router.get('/pending', getPendingPlaces);

router.post('/:id/images', upload.array('images', 5), uploadImages);

router.route('/:id')
  .get(getPlaceById)
  .put(updatePlace)
  .delete(deletePlace);

router.patch('/:id/approve', approvePlace);
router.patch('/:id/reject', rejectPlace);

export default router;
