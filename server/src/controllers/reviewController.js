import { Review } from '../models/Review.js';

// GET /api/reviews
// TODO: implement per README.md section 2.
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find();
    return res.status(200).json({ reviews });
  } catch (err) { next(err); }
}

// GET /api/reviews/:id
// TODO: implement per README.md section 2.
export async function getReview(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    return res.status(200).json({ review });
  } catch (err) { next(err); }
}

// POST /api/reviews
// TODO: implement per README.md section 2.
export async function createReview(req, res, next) {
  try {
    const { facilityCode, rating, comment, reviewedBy } = req.body;

    const review = await Review.create({
      facilityCode,
      rating,
      comment,
      reviewedBy,
    });

    return res.status(201).json({ review });
  } catch (err) { next(err); }
}

// GET /api/reviews/summary?facilityCode=FC101
// TODO: implement per README.md section 3.
export async function getReviewSummary(req, res, next) {
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

    return res.status(200).json({
      facilityCode: summary[0]._id,
      averageRating: summary[0].averageRating,
      reviewCount: summary[0].reviewCount,
    });
  } catch (err) { next(err); }
}
module.exports = {
  createReview,
  getAllReviews,
  getReviewSummary,
  getReview,
};
