const express = require('express');

const {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary,
} = require('../controllers/reviewController');

const router = express.Router();


// ============================================================
// POST /api/reviews
// Create a new review
// ============================================================
router.post('/', createReview);


// ============================================================
// GET /api/reviews
// Get all reviews
// ============================================================
router.get('/', getAllReviews);


// ============================================================
// GET /api/reviews/summary?facilityCode=FC101
// Get review summary for a facility
//
// IMPORTANT:
// This route MUST come before /:id.
//
// Otherwise Express could interpret "summary" as:
// req.params.id = "summary"
// ============================================================
router.get('/summary', getReviewSummary);


// ============================================================
// GET /api/reviews/:id
// Get one review by ID
// ============================================================
router.get('/:id', getReview);


module.exports = router;