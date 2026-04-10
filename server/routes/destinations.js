import { Router } from 'express';
import Destination from '../models/Destination.js';

const router = Router();

// GET /api/destinations — list all, optional ?category= filter
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { subtitle: new RegExp(search, 'i') },
        { district: new RegExp(search, 'i') },
      ];
    }

    const destinations = await Destination.find(filter).sort({ rating: -1 });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/destinations/:id — get single by destinationId
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findOne({ destinationId: req.params.id });
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/destinations — create a new destination
router.post('/', async (req, res) => {
  try {
    const destination = new Destination(req.body);
    const saved = await destination.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
