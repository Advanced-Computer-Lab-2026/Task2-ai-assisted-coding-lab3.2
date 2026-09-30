import mongoose from 'mongoose';
import { Review } from '../models/Review.js';

export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json({ reviews });
  } catch (err) { next(err); }
}

export async function getReview(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    return res.status(200).json({ review });
  } catch (err) { next(err); }
}

export async function createReview(req, res, next) {
  try {
    const { facilityCode, rating, comment, reviewedBy } = req.body ?? {};
    const review = await Review.create({ facilityCode, rating, comment, reviewedBy });
    return res.status(201).json({ review });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This user has already reviewed this facility' });
    }
    next(err);
  }
}

export async function getReviewSummary(req, res, next) {
  try {
    const { facilityCode } = req.query;
    if (typeof facilityCode !== 'string' || facilityCode.trim() === '') {
      return res.status(400).json({ message: 'facilityCode is required' });
    }

    const [result] = await Review.aggregate([
      { $match: { facilityCode } },
      {
        $group: {
          _id: '$facilityCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({
      facilityCode,
      averageRating: result ? result.averageRating : 0,
      reviewCount: result ? result.reviewCount : 0
    });
  } catch (err) { next(err); }
}