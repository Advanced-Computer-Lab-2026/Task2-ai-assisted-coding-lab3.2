import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// Summary must come before /:id to prevent it being treated as an ID
router.get('/summary', getReviewSummary);
router.get('/', getAllReviews);
router.get('/:id', getReview);
router.post('/', createReview);

export default router;
