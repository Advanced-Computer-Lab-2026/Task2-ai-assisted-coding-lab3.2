import { Router } from 'express';
import {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

router.post('/', createReview);
router.get('/summary', getReviewSummary);
router.get('/:id', getReview);
router.get('/', getAllReviews);

export default router;
