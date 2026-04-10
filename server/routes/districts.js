import { Router } from 'express';
import District from '../models/District.js';

const router = Router();

// GET /api/districts — list all districts with activities
router.get('/', async (req, res) => {
  try {
    const districts = await District.find().sort({ name: 1 });
    res.json(districts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/districts/:id — get single district by districtId
router.get('/:id', async (req, res) => {
  try {
    const district = await District.findOne({ districtId: req.params.id });
    if (!district) {
      return res.status(404).json({ message: 'District not found' });
    }
    res.json(district);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
