import { Router } from 'express';
import Review from '../models/Review.js';

const router = Router();

// GET /api/reviews/:destinationId — get reviews for a destination
router.get('/:destinationId', async (req, res) => {
  try {
    const reviews = await Review.find({ destinationId: req.params.destinationId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reviews — submit a new review
router.post('/', async (req, res) => {
  try {
    const { destinationId, name, rating, text } = req.body;
    if (!destinationId || !name || !rating || !text) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const review = new Review({ destinationId, name, rating, text, date: 'Just now' });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
