import express from 'express';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

// Summary endpoint must come before /:id to avoid conflict
router.get('/summary', reviewController.getReviewSummary);

router.get('/', reviewController.getAllReviews);
router.post('/', reviewController.createReview);
router.get('/:id', reviewController.getReview);

export default router;
