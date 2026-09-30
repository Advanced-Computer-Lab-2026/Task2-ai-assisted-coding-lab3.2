import { Router } from 'express';
import {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// Summary must be before :id to avoid conflict
router.get('/summary', getReviewSummary);
router.get('/', getAllReviews);
router.get('/:id', getReview);
router.post('/', createReview);

export default router;
