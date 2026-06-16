import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: { 
    type: String, 
    enum: [
      'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 
      'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 
      'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 
      'Kannur', 'Kasaragod'
    ],
    required: true 
  },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  category: { 
    type: String, 
    enum: ['adventure', 'cultural', 'nature', 'food', 'spiritual', 'water-sports', 'trekking', 'other'],
    required: true
  },
  description: { type: String },
  duration: { type: String },
  difficulty: { type: String, enum: ['easy', 'moderate', 'hard'] },
  bestSeason: [{ type: String }],
  price: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' }
  },
  images: [{ type: String }],
  contactInfo: {
    phone: { type: String },
    email: { type: String },
    website: { type: String }
  },
  isActive: { type: Boolean, default: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.models.Activity || mongoose.model('Activity', activitySchema);
