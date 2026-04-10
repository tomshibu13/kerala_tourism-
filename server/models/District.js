import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  description: { type: String },
  category: { type: String },
});

const districtSchema = new mongoose.Schema({
  districtId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  activities: [activitySchema],
  famousFor: [{
    type: String,
  }],
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  population: {
    type: String,
  },
  area: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('District', districtSchema);
