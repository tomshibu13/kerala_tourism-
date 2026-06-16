import Review from '../models/Review.js';

export const getReviews = async (req, res) => {
  try {
    const { status, flagged } = req.query;
    let query = {};
    if (status) query.status = status;
    if (flagged !== undefined) query.flagged = flagged === 'true';

    const reviews = await Review.find(query)
      .populate('place', 'name district')
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });
      
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

export const getFlaggedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ flagged: true })
      .populate('place', 'name')
      .populate('user', 'name email');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flagged reviews' });
  }
};

export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    review.status = 'approved';
    review.flagged = false;
    await review.save();
    res.json({ message: 'Review approved', review });
  } catch (error) {
    res.status(500).json({ message: 'Error approving review' });
  }
};

export const rejectReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    review.status = 'rejected';
    await review.save();
    res.json({ message: 'Review rejected', review });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting review' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};
