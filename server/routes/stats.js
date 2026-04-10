import { Router } from 'express';
import Destination from '../models/Destination.js';

const router = Router();

// GET /api/stats — return stats and categories
router.get('/', async (req, res) => {
  try {
    const totalDestinations = await Destination.countDocuments();
    const districts = await Destination.distinct('district');
    const beaches = await Destination.countDocuments({ category: 'Beach' });
    const wildlife = await Destination.countDocuments({ category: 'Wildlife' });

    const stats = [
      { label: 'Destinations', value: totalDestinations || 50, suffix: '+' },
      { label: 'Districts', value: districts.length || 14, suffix: '' },
      { label: 'Beaches', value: beaches || 30, suffix: '+' },
      { label: 'Wildlife Sanctuaries', value: wildlife || 16, suffix: '' },
    ];

    const categories = [
      { id: 'beach', name: 'Beach', icon: '🏖️', color: '#1D9E75' },
      { id: 'hills', name: 'Hills', icon: '⛰️', color: '#0F6E56' },
      { id: 'backwaters', name: 'Backwaters', icon: '🛶', color: '#25c28f' },
      { id: 'wildlife', name: 'Wildlife', icon: '🐘', color: '#D4A843' },
      { id: 'temples', name: 'Temples', icon: '🛕', color: '#E8C96A' },
    ];

    res.json({ stats, categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
