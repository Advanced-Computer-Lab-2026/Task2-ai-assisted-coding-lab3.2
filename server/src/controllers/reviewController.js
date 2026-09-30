import { Review } from '../models/Review.js';

export const createReview = async (req, res, next) => {
  try {
    const { facilityCode, rating, comment, reviewedBy } = req.body;

    if (!facilityCode || rating === undefined) {
      return res.status(400).json({ message: 'facilityCode and rating are required' });
    }

    const review = await Review.create({
      facilityCode,
      rating,
      comment,
      reviewedBy,
    });

    res.status(201).json({ review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'User has already reviewed this facility' });
    }
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

    const summary = await Review.aggregate([
      { $match: { facilityCode } },
      {
        $group: {
          _id: '$facilityCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (summary.length === 0) {
      return res.status(200).json({
        facilityCode,
        averageRating: 0,
        reviewCount: 0,
      });
    }

    const result = summary[0];
    res.status(200).json({
      facilityCode: result._id,
      averageRating: result.averageRating,
      reviewCount: result.reviewCount,
    });
  } catch (err) {
    next(err);
  }
};
