import { Review } from '../models/Review.js';

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id).lean();
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ review });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/summary/:facilityCode
export async function getReviewSummary(req, res, next) {
  try {
    const { facilityCode } = req.params;
    const stats = await Review.aggregate([
      { $match: { facilityCode } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this facility' });
    }

    const summary = stats[0];
    res.json({
      facilityCode,
      averageRating: Number(summary.averageRating.toFixed(2)),
      totalReviews: summary.totalReviews,
    });
  } catch (err) {
    next(err);
  }
}
