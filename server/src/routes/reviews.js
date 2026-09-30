import express from 'express';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/summary', reviewController.getReviewSummary);
router.get('/:id', reviewController.getReview);

export default router;
