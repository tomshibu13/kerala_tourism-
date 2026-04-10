import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  destinations: [{
    type: String,
    required: true,
  }],
  tripDays: {
    type: Number,
    required: true,
    min: 1,
    max: 30,
  },
  startDate: {
    type: String,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Trip', tripSchema);
