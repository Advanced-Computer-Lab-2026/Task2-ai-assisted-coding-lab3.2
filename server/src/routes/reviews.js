import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// The summary route must come BEFORE /:id to avoid being captured by the id parameter
router.get('/summary', getReviewSummary);

router.get('/', getAllReviews);
router.get('/:id', getReview);
router.post('/', createReview);

export default router;
