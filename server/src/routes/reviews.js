import express from 'express';
import {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary
} from '../controllers/reviewController.js';

const router = express.Router();

// Summary route MUST come before /:id
router.get('/summary', getReviewSummary);

router.route('/')
  .get(getAllReviews)
  .post(createReview);

router.get('/:id', getReview);

export default router;
