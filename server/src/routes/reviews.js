import express from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = express.Router();

// GET /api/reviews/summary
// Must be defined before /:id to prevent "summary" being interpreted as an ID
router.get('/summary', getReviewSummary);

// GET /api/reviews
router.get('/', getAllReviews);

// POST /api/reviews
router.post('/', createReview);

// GET /api/reviews/:id
router.get('/:id', getReview);

export default router;
