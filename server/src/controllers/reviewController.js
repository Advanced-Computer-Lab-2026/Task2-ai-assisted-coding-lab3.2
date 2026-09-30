import Joi from 'joi';
import { Review } from '../models/Review.js';

const idSchema = Joi.string().hex().length(24);

const createSchema = Joi.object({
  facilityCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(''),
  reviewedBy: idSchema
});

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    if (idSchema.validate(req.params.id).error) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const review = await Review.create(value);
    res.status(201).json({ review });
  } catch (err) {
    // 11000 = duplicate key: the (facilityCode, reviewedBy) unique index was violated.
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This user has already reviewed this facility' });
    }
    next(err);
  }
}

// GET /api/reviews/summary?facilityCode=FC101
export async function getReviewSummary(req, res, next) {
  try {
    const { facilityCode } = req.query;
    // Must be a plain string: ?facilityCode[$ne]=x would otherwise inject an operator into $match.
    if (typeof facilityCode !== 'string' || !facilityCode) {
      return res.status(400).json({ message: 'facilityCode is required' });
    }

    const [stats] = await Review.aggregate([
      { $match: { facilityCode } },
      { $group: { _id: '$facilityCode', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ]);

    res.json({
      facilityCode,
      averageRating: stats ? stats.averageRating : 0,
      reviewCount: stats ? stats.reviewCount : 0
    });
  } catch (err) { next(err); }
}
