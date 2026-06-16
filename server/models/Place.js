import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
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
  category: { 
    type: String, 
    enum: ['beach', 'hills', 'backwaters', 'wildlife', 'temple', 'heritage', 'waterfall', 'other'],
    required: true
  },
  description: { type: String },
  images: [{ type: String }],
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  bestMonths: [{ type: Number }],
  entryFee: { type: Number },
  timings: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  submittedAt: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  rejectionReason: { type: String },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isAdminAdded: { type: Boolean, default: false },
  tags: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.Place || mongoose.model('Place', placeSchema);
