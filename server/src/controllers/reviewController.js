import Review from '../models/Review.js';

export const createReview = async (req, res, next) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.json({ reviews });
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
    res.json({ review });
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
      {
        $match: { facilityCode }
      },
      {
        $group: {
          _id: '$facilityCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          facilityCode: '$_id',
          averageRating: 1,
          reviewCount: 1
        }
      }
    ]);

    if (summary.length === 0) {
      return res.json({ facilityCode, averageRating: 0, reviewCount: 0 });
    }

    res.json(summary[0]);
  } catch (err) {
    next(err);
  }
};
