import express from 'express';
import { getAllReviews, getReview, createReview, getReviewSummary } from '../controllers/reviewController.js';

const router = express.Router();

router.route('/summary')
  .get(getReviewSummary);

router.route('/')
  .get(getAllReviews)
  .post(createReview);

router.route('/:id')
  .get(getReview);

export default router;
