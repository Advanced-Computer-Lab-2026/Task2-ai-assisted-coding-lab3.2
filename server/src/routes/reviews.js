import { Router } from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = Router();

router.get('/', getAllReviews);
// Must be registered before /:id so "summary" isn't treated as an id.
router.get('/summary', getReviewSummary);
router.get('/:id', getReview);
router.post('/', createReview);

export default router;
