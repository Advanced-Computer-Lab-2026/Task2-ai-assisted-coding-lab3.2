import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

// The /summary route must be defined BEFORE /:id to avoid being treated as an ID
router.get('/summary', getReviewSummary);

router.get('/', getAllReviews);
router.get('/:id', getReview);
router.post('/', createReview);

export default router;
