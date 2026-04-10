import { Router } from 'express';
import Trip from '../models/Trip.js';

const router = Router();

// POST /api/trips — save a trip plan
router.post('/', async (req, res) => {
  try {
    const { destinations, tripDays, startDate, notes } = req.body;
    if (!destinations || !tripDays) {
      return res.status(400).json({ message: 'Destinations and tripDays are required' });
    }
    const trip = new Trip({ destinations, tripDays, startDate, notes });
    const saved = await trip.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/trips/:id — get a saved trip
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
