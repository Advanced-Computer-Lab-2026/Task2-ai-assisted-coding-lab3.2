import { Review } from '../models/Review.js';

// Maps Mongoose validation / cast / duplicate-key errors to client errors.
function handleError(err, res, next) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Review already exists for this facility and user' });
  }
  next(err);
}

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) { handleError(err, res, next); }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review });
  } catch (err) { handleError(err, res, next); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { facilityCode, rating, comment, reviewedBy } = req.body;
    const review = await Review.create({ facilityCode, rating, comment, reviewedBy });
    res.status(201).json({ review });
  } catch (err) { handleError(err, res, next); }
}

// GET /api/reviews/summary?facilityCode=FC101
export async function getReviewSummary(req, res, next) {
  try {
    const { facilityCode } = req.query;
    if (typeof facilityCode !== 'string' || !facilityCode) {
      return res.status(400).json({ message: 'facilityCode is required' });
    }

    const [result] = await Review.aggregate([
      { $match: { facilityCode } },
      { $group: { _id: '$facilityCode', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ]);

    res.json({
      facilityCode,
      averageRating: result ? result.averageRating : 0,
      reviewCount: result ? result.reviewCount : 0
    });
  } catch (err) { handleError(err, res, next); }
}
