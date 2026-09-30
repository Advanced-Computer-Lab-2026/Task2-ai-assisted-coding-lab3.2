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
    const review = await Review.findById(req.params.id);
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
    const { facilityCode, rating, comment, reviewedBy } = req.body;

    // Basic validation
    if (!facilityCode || rating === undefined) {
      return res.status(400).json({ message: 'facilityCode and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({
      facilityCode,
      rating,
      comment,
      reviewedBy
    });

    res.status(201).json({ review });
  } catch (err) {
    // Handle MongoDB duplicate key error (compound index violation)
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already reviewed this facility' });
    }
    next(err);
  }
}

// GET /api/reviews/summary?facilityCode=FC101
export async function getReviewSummary(req, res, next) {
  try {
    const { facilityCode } = req.query;

    if (!facilityCode) {
      return res.status(400).json({ message: 'facilityCode is required' });
    }

    const result = await Review.aggregate([
      { $match: { facilityCode: facilityCode } },
      {
        $group: {
          _id: '$facilityCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({
        facilityCode,
        averageRating: 0,
        reviewCount: 0
      });
    }

    const summary = result[0];
    res.json({
      facilityCode: summary._id,
      averageRating: summary.averageRating,
      reviewCount: summary.reviewCount
    });
  } catch (err) {
    next(err);
  }
}
