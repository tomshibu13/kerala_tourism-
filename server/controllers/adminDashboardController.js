import Place from '../models/Place.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Review from '../models/Review.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalPlaces, pendingPlaces, approvedPlaces, rejectedPlaces,
      totalUsers, activeUsers,
      totalActivities,
      totalReviews, flaggedReviews,
      recentSubmissions, recentUsers
    ] = await Promise.all([
      Place.countDocuments(),
      Place.countDocuments({ status: 'pending' }),
      Place.countDocuments({ status: 'approved' }),
      Place.countDocuments({ status: 'rejected' }),
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Activity.countDocuments(),
      Review.countDocuments(),
      Review.countDocuments({ flagged: true }),
      Place.find().sort({ createdAt: -1 }).limit(5).populate('submittedBy', 'name email'),
      User.find().sort({ createdAt: -1 }).limit(5).select('-password')
    ]);

    const placesByDistrict = await Place.aggregate([
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $project: { district: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    const placesByCategory = await Place.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
    
    // Calculate new users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.json({
      totalPlaces, pendingPlaces, approvedPlaces, rejectedPlaces,
      totalUsers, activeUsers, newUsersThisMonth,
      totalActivities, activitiesByDistrict: [], // Optionally add aggregate for activities 
      totalReviews, flaggedReviews,
      recentSubmissions,
      recentUsers,
      placesByDistrict,
      placesByCategory
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving dashboard stats' });
  }
};
