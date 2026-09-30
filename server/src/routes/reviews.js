import express from 'express';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', reviewController.getAllReviews);
router.post('/', reviewController.createReview);
router.get('/summary', reviewController.getReviewSummary);
router.get('/:id', reviewController.getReview);

export default router;
