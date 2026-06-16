import Activity from '../models/Activity.js';

export const getActivities = async (req, res) => {
  try {
    const { district, category } = req.query;
    let query = {};
    if (district) query.district = district;
    if (category) query.category = category;
    
    const activities = await Activity.find(query)
      .populate('place', 'name')
      .populate('addedBy', 'name');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
};

export const getActivitiesByDistrict = async (req, res) => {
  try {
    const activities = await Activity.find({ district: req.params.name })
      .populate('place', 'name');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities for district' });
  }
};

export const addActivity = async (req, res) => {
  try {
    const activity = new Activity({ ...req.body, addedBy: req.user._id });
    const savedActivity = await activity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(500).json({ message: 'Error adding activity', error: error.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error updating activity' });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    res.json({ message: 'Activity removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity' });
  }
};

export const toggleActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    activity.isActive = !activity.isActive;
    await activity.save();
    res.json({ message: 'Activity status updated', activity });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling activity' });
  }
};
