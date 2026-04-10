import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  destinationId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: 'Just now',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Review', reviewSchema);
