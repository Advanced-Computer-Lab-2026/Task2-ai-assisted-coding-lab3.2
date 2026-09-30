import { Router } from 'express';
import {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

router.get('/summary', getReviewSummary);
router.get('/', getAllReviews);
router.get('/:id', getReview);
router.post('/', createReview);

export default router;
