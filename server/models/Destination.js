import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  destinationId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Beach', 'Hills', 'Backwaters', 'Wildlife', 'Temples', 'Culture', 'Waterfalls', 'Heritage'],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  highlights: [{
    type: String,
  }],
  bestSeason: {
    type: String,
  },
  district: {
    type: String,
    required: true,
  },
  weatherTemp: {
    type: String,
  },
  weatherCondition: {
    type: String,
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
}, {
  timestamps: true,
});

export default mongoose.model('Destination', destinationSchema);
