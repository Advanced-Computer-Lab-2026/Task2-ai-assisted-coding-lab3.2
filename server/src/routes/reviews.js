import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// GET /api/reviews/summary (Must be before /:id)
router.get('/summary', getReviewSummary);

// GET /api/reviews
router.get('/', getAllReviews);

// GET /api/reviews/:id
router.get('/:id', getReview);

// POST /api/reviews
router.post('/', createReview);

export default router;
