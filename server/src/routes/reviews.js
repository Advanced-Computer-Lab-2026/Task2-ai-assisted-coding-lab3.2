import express from 'express';
import {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary,
} from '../controllers/reviewController.js';

const router = express.Router();

// Register /summary BEFORE /:id to avoid parameter conflict
router.get('/summary', getReviewSummary);

router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/:id', getReview);

export default router;
