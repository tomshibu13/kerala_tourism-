import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import destinationRoutes from './routes/destinations.js';
import districtRoutes from './routes/districts.js';
import reviewRoutes from './routes/reviews.js';
import tripRoutes from './routes/trips.js';
import statRoutes from './routes/stats.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
await connectDB();

// Routes
app.use('/api/destinations', destinationRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/stats', statRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Kerala Tourism API is running 🌴' });
});

app.listen(PORT, () => {
  console.log(`🌴 Kerala Tourism API running on http://localhost:${PORT}`);
});
