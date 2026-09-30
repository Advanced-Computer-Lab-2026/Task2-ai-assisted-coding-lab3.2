import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// Summary must be defined BEFORE /:id to avoid conflict
router.get('/summary', getReviewSummary);
router.get('/', getAllReviews);
router.post('/', createReview);
router.get('/:id', getReview);

export default router;
