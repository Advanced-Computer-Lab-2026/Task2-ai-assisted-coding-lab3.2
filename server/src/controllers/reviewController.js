import { Review } from '../models/Review.js';

export const createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'User has already reviewed this facility' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate('reviewedBy', 'name email');
    res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ review });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Review not found' });
    }
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
      {
        $project: {
          _id: 0,
          facilityCode: '$_id',
          averageRating: { $round: ['$averageRating', 2] },
          reviewCount: 1,
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

    res.status(200).json(summary[0]);
  } catch (err) {
    next(err);
  }
};
