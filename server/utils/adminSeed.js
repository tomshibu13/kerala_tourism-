import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';
import Place from '../models/Place.js';
import Activity from '../models/Activity.js';
import connectDB from '../config/db.js';

const seedData = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('❌ ERROR: ADMIN_EMAIL or ADMIN_PASSWORD is not set in .env file!');
      process.exit(1);
    }

    // 1. Create one admin user
    const adminExists = await User.findOne({ email: adminEmail });
    let adminUser;
    
    if (!adminExists) {
      const newAdmin = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      adminUser = await newAdmin.save();
      console.log(`✅ Admin user created with email: ${adminEmail}`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      await User.updateOne(
        { email: adminEmail }, 
        { $set: { password: hashedPassword, role: 'admin' } }
      );
      adminUser = await User.findOne({ email: adminEmail });
      console.log(`✅ Admin user password reset dynamically for: ${adminEmail}`);
    }

    // Default seeded submitted user
    const testUserExists = await User.findOne({ email: 'test@kerala.guide' });
    let testUser = testUserExists;
    if (!testUserExists) {
      testUser = await User.create({
        name: 'Test Contributor',
        email: 'test@kerala.guide',
        password: 'Password@123',
        role: 'user',
      });
    }

    // 2. Sample Pending Places
    const pendingPlacesCount = await Place.countDocuments({ status: 'pending' });
    if (pendingPlacesCount === 0) {
      const placesToSeed = [
        { name: 'Secret Beach', district: 'Kannur', category: 'beach', description: 'A hidden beach not known to many.', status: 'pending', submittedBy: testUser._id },
        { name: 'Mountain Peak Retreat', district: 'Idukki', category: 'hills', description: 'High altitude retreat.', status: 'pending', submittedBy: testUser._id },
        { name: 'Village Backwater Tour', district: 'Alappuzha', category: 'backwaters', description: 'Local village vibes.', status: 'pending', submittedBy: testUser._id },
        { name: 'Unknown Elephant Sanctuary', district: 'Wayanad', category: 'wildlife', description: 'A small elephant sanctuary.', status: 'pending', submittedBy: testUser._id },
        { name: 'Ancient Shiva Temple', district: 'Thrissur', category: 'temple', description: 'Very old ruins discovered recently.', status: 'pending', submittedBy: testUser._id }
      ];
      await Place.insertMany(placesToSeed);
      console.log('✅ Pending places seeded');
    }

    // 3. Fake Activities
    const activityCount = await Activity.countDocuments();
    if (activityCount === 0) {
      const activitiesToSeed = [
        { name: 'Scuba Diving', district: 'Thiruvananthapuram', category: 'water-sports', description: 'Dive deep into the ocean.', duration: '2 hours', difficulty: 'moderate', isActive: true, addedBy: adminUser._id },
        { name: 'Munnar Tea Tour', district: 'Idukki', category: 'nature', description: 'Explore vast tea estates.', duration: '4 hours', difficulty: 'easy', isActive: true, addedBy: adminUser._id },
        { name: 'Alleppey Houseboat', district: 'Alappuzha', category: 'nature', description: 'Overnight stay in a houseboat.', duration: '1 day', difficulty: 'easy', isActive: true, addedBy: adminUser._id },
        { name: 'Wayanad Trekking', district: 'Wayanad', category: 'trekking', description: 'Trek to Chembra peak.', duration: '5 hours', difficulty: 'hard', isActive: true, addedBy: adminUser._id },
      ];
      await Activity.insertMany(activitiesToSeed);
      console.log('✅ Activities seeded');
    }

    console.log('✅ Seeding completed');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
