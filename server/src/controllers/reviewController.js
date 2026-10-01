import Joi from 'joi';
import { Review } from '../models/Review.js';

const createSchema = Joi.object({
  facilityCode: Joi.string().trim().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow('').optional(),
  reviewedBy: Joi.string().hex().length(24).optional()
});

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const review = await Review.create({
      facilityCode: value.facilityCode,
      rating: value.rating,
      ...(value.comment !== undefined ? { comment: value.comment } : {}),
      ...(value.reviewedBy !== undefined ? { reviewedBy: value.reviewedBy } : {})
    });
    res.status(201).json({ review });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Review already exists for this facility and reviewer' });
    }
    next(err);
  }
}

// GET /api/reviews/summary?facilityCode=FC101
export async function getReviewSummary(req, res, next) {
  try {
    const facilityCode = req.query.facilityCode;
    if (!facilityCode) return res.status(400).json({ message: 'facilityCode is required' });

    const result = await Review.aggregate([
      { $match: { facilityCode } },
      {
        $group: {
          _id: '$facilityCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({ facilityCode, averageRating: 0, reviewCount: 0 });
    }

    res.json({
      facilityCode,
      averageRating: result[0].averageRating,
      reviewCount: result[0].reviewCount
    });
  } catch (err) { next(err); }
}
