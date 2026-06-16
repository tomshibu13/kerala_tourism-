import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import destinationRoutes from './routes/destinations.js';
import districtRoutes from './routes/districts.js';
import reviewRoutes from './routes/reviews.js';
import tripRoutes from './routes/trips.js';
import statRoutes from './routes/stats.js';

import adminAuthRoutes from './routes/admin/authRoutes.js';
import adminPlaceRoutes from './routes/admin/placeRoutes.js';
import adminActivityRoutes from './routes/admin/activityRoutes.js';
import adminUserRoutes from './routes/admin/userRoutes.js';
import adminReviewRoutes from './routes/admin/reviewRoutes.js';
import adminDashboardRoutes from './routes/admin/dashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
await connectDB();

import authRoutes from './routes/authRoutes.js';

// Consumer Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/stats', statRoutes);

// Admin Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/places', adminPlaceRoutes);
app.use('/api/admin/activities', adminActivityRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/reviews', adminReviewRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Kerala Tourism API is running 🌴' });
});

// Admin error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌴 Kerala Tourism API running on http://localhost:${PORT}`);
});
