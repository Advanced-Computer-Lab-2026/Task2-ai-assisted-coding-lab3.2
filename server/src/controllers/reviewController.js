const mongoose = require('mongoose');
const Review = require('../models/Review');

// ============================================================
// POST /api/reviews
// Create a new review
// ============================================================
const createReview = async (req, res, next) => {
  try {
    // Create a Review document using the data sent in req.body
    const review = await Review.create(req.body);

    // Successfully created -> HTTP 201
    res.status(201).json({ review });
  } catch (err) {
    // Pass unexpected errors to Express error-handling middleware
    next(err);
  }
};


// ============================================================
// GET /api/reviews
// Get all reviews
// ============================================================
const getAllReviews = async (req, res, next) => {
  try {
    // Find all Review documents in MongoDB
    const reviews = await Review.find();

    // Successfully retrieved -> HTTP 200
    res.status(200).json({ reviews });
  } catch (err) {
    // Pass unexpected errors to Express error-handling middleware
    next(err);
  }
};


// ============================================================
// GET /api/reviews/:id
// Get one review by its MongoDB ID
// ============================================================
const getReview = async (req, res, next) => {
  try {
    // req.params.id comes from the URL:
    // /api/reviews/68abc123...
    const { id } = req.params;

    // Find the review whose _id matches the URL id
    const review = await Review.findById(id);

    // A valid ID may still refer to no document
    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
      });
    }

    // Review exists -> HTTP 200
    res.status(200).json({ review });
  } catch (err) {
    // Pass unexpected errors to Express error-handling middleware
    next(err);
  }
};


// ============================================================
// GET /api/reviews/summary?facilityCode=FC101
// Get average rating and number of reviews for a facility
// ============================================================
const getReviewSummary = async (req, res, next) => {
  try {
    // Read facilityCode from the query string
    //
    // Example:
    // /api/reviews/summary?facilityCode=FC101
    //
    // req.query.facilityCode === "FC101"
    const { facilityCode } = req.query;

    // facilityCode is required
    if (!facilityCode) {
      return res.status(400).json({
        message: 'facilityCode is required',
      });
    }

    // Use MongoDB aggregation as required by the task.
    //
    // Stage 1: $match
    // Keep only reviews belonging to this facility.
    //
    // Stage 2: $group
    // Calculate:
    // - average rating using $avg
    // - number of reviews using $sum: 1
    const result = await Review.aggregate([
      {
        $match: {
          facilityCode: facilityCode,
        },
      },
      {
        $group: {
          _id: '$facilityCode',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    // If there are no reviews for this facility,
    // aggregation returns an empty array.
    if (result.length === 0) {
      return res.status(200).json({
        facilityCode,
        averageRating: 0,
        reviewCount: 0,
      });
    }

    // result[0] contains the aggregation result
    res.status(200).json({
      facilityCode,
      averageRating: result[0].averageRating,
      reviewCount: result[0].reviewCount,
    });
  } catch (err) {
    // Pass unexpected errors to Express error-handling middleware
    next(err);
  }
};


// Export all controller functions so the router can use them
module.exports = {
  createReview,
  getAllReviews,
  getReview,
  getReviewSummary,
};