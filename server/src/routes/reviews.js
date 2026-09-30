import { Router } from 'express';
import {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/summary', getReviewSummary); // MUST be before /:id
router.get('/:id', getReview);

export default router;
