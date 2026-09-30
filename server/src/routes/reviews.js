import express from "express";
const router = express.Router();
import * as reviewController from '../controllers/reviewController.js';

// Summary must come before :id to avoid being captured as an ID
router.get('/summary', reviewController.getReviewSummary);

router.route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);

router.get('/:id', reviewController.getReview);

export default router;
