import Place from '../models/Place.js';
import cloudinary from '../config/cloudinary.js';

export const getPlaces = async (req, res) => {
  try {
    const { status, district, category, search } = req.query;
    let query = {};
    if (status) query.status = status;
    if (district) query.district = district;
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    const places = await Place.find(query).populate('submittedBy', 'name email').sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving places' });
  }
};

export const getPendingPlaces = async (req, res) => {
  try {
    const places = await Place.find({ status: 'pending' }).populate('submittedBy', 'name email');
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving pending places' });
  }
};

export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate('submittedBy', 'name email');
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving place' });
  }
};

export const addPlace = async (req, res) => {
  try {
    // Basic fields validation could go here
    const place = new Place({
      ...req.body,
      isAdminAdded: true,
      status: 'approved',
      submittedBy: null
    });
    const savedPlace = await place.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(500).json({ message: 'Error adding place', error: error.message });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: 'Error updating place' });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json({ message: 'Place removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting place' });
  }
};

export const approvePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    
    place.status = 'approved';
    place.reviewedBy = req.user._id;
    place.reviewedAt = Date.now();
    await place.save();
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: 'Error approving place' });
  }
};

export const rejectPlace = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    
    place.status = 'rejected';
    place.rejectionReason = rejectionReason;
    place.reviewedBy = req.user._id;
    place.reviewedAt = Date.now();
    await place.save();
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting place' });
  }
};

export const uploadImages = async (req, res) => {
  try {
    // Using multer memory storage, so files are in req.files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'kerala_tourism' },
          (error, result) => {
            if (result) {
              resolve(result.secure_url);
            } else {
              reject(error);
            }
          }
        );
        stream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading images', error: error.message });
  }
};
