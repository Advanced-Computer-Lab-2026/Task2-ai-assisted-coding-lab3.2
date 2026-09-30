import { Review } from '../models/Review.js';

// GET /api/reviews
// TODO: implement per README.md section 2.
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
// TODO: implement per README.md section 2.
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id).lean();
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
// TODO: implement per README.md section 2.
export async function createReview(req, res, next) {
  try {
    const { facilityCode, rating, comment, reviewedBy } = req.body;
    const review = new Review({ facilityCode, rating, comment, reviewedBy });
    await review.save();
    res.status(201).json({ review });
  } catch (err) { next(err); }
}

// GET /api/reviews/summary?facilityCode=FC101
// TODO: implement per README.md section 3.
export async function getReviewSummary(req, res, next) {
  try {
    const { facilityCode } = req.query;
    if (!facilityCode) {
      return res.status(400).json({ message: 'facilityCode is required' });
    }
    const summary = await Review.aggregate([
      { $match: { facilityCode } },
      {
        $group: {
          _id: '$facilityCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);
    if (summary.length === 0) {
      return res.json({ facilityCode, averageRating: 0, reviewCount: 0 });
    }
    res.json({ facilityCode, averageRating: summary[0].averageRating, reviewCount: summary[0].reviewCount });
  } catch (err) { next(err); }
}
