import Review from '../models/Review.js';

export const createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ review });
  } catch (error) {
    next(error);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ review });
  } catch (error) {
    next(error);
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
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    // If there are no reviews for this facility yet
    if (summary.length === 0) {
      return res.status(200).json({
        facilityCode,
        averageRating: 0,
        reviewCount: 0
      });
    }

    res.status(200).json({
      facilityCode: summary[0]._id,
      averageRating: summary[0].averageRating,
      reviewCount: summary[0].reviewCount
    });
  } catch (error) {
    next(error);
  }
};