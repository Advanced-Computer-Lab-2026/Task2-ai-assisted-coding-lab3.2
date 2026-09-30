import Joi from 'joi';
import { Review } from '../models/Review.js';

const createSchema = Joi.object({
  facilityCode: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow(''),
  reviewedBy: Joi.string().hex().length(24).optional(),
});

export const createReview = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const review = await Review.create(value);
    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().lean();
    res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).lean();
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
};

export const getReviewSummary = async (req, res, next) => {
  try {
    const { facilityCode } = req.query;
    if (!facilityCode) {
      return res.status(400).json({ message: 'facilityCode is required' });
    }

    const result = await Review.aggregate([
      { $match: { facilityCode } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        facilityCode,
        averageRating: 0,
        reviewCount: 0,
      });
    }

    const { averageRating, reviewCount } = result[0];
    res.status(200).json({
      facilityCode,
      averageRating,
      reviewCount,
    });
  } catch (err) {
    next(err);
  }
};
