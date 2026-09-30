import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary,
} from '../controllers/reviewController.js';

const router = Router();

// /summary must be defined before /:id
router.get('/summary', getReviewSummary);
router.get('/', getAllReviews);
router.post('/', createReview);
router.get('/:id', getReview);

export default router;
