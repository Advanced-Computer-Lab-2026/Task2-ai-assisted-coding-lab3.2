import Joi from 'joi';
import { Review } from '../models/Review.js';

const createSchema = Joi.object({
  facilityCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow('', null),
  reviewedBy: Joi.string().hex().length(24)
});


function publicReview(review) {
  return {name: review.name, email: review.email, createdAt: review.createdAt };
}
// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ reviews: publicReview(reviews) });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ review: publicReview(reviews) });
  } catch (err) { next(err); }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const existing = await Review.findOne({ facilityCode: value.facilityCode, reviewedBy: value.reviewedBy });
    if(existing) return res.status(409).json({ message: 'User has already reviewed this facility' });
    const review = await Review.create(value);
    res.status(201).json({ review: publicReview(review) });
  } catch (err) { next(err); }
}

// GET /api/reviews/summary?facilityCode=FC101
export async function getReviewSummary(req, res, next) {
  try {
    const { facilityCode } = req.query;
    if (!facilityCode) return res.status(400).json({ message: 'facilityCode is required' });

    const [result] = await Review.aggregate([
      { $match: { facilityCode } },
      { $group: { _id: '$facilityCode', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ]);

    res.json({
      facilityCode,
      averageRating: result ? result.averageRating : 0,
      reviewCount: result ? result.reviewCount : 0
    });
  } catch (err) { next(err); }
}