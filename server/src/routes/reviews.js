import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// Order is important: /summary must come before /:id
router.get('/summary', getReviewSummary);
router.get('/', getAllReviews);
router.post('/', createReview);
router.get('/:id', getReview);

export default router;
