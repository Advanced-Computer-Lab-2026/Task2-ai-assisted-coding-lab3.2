import express from 'express';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

router.get('/summary', reviewController.getReviewSummary);
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReview);
router.post('/', reviewController.createReview);

export default router;
