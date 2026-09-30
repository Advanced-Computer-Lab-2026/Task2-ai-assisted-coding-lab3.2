import Joi from 'joi';
import { Review } from '../models/Review.js';

const createSchema = Joi.object({
  facilityCode: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().optional(),
  reviewedBy: Joi.string().hex().length(24).optional()
});

function publicReview(r) {
  return {
    id: r._id.toString(),
    facilityCode: r.facilityCode,
    rating: r.rating,
    comment: r.comment,
    reviewedBy: r.reviewedBy,
    createdAt: r.createdAt
  };
}

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json({ reviews: reviews.map(publicReview) });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id).lean();
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review: publicReview(review) });
  } catch (err) { next(err); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const review = await Review.create(value);
    res.status(201).json({ review: publicReview(review) });
  } catch (err) {
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
    if (!facilityCode) return res.status(400).json({ message: 'facilityCode is required' });

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
      return res.json({
        facilityCode,
        averageRating: 0,
        reviewCount: 0
      });
    }

    const result = summary[0];
    res.json({
      facilityCode: result._id,
      averageRating: result.averageRating,
      reviewCount: result.reviewCount
    });
  } catch (err) { next(err); }
}
