import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  flagReason: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
