const mongoose = require('mongoose');

// Define the schema for a facility review
const reviewSchema = new mongoose.Schema(
  {
    // The code identifying the facility being reviewed
    // Example: "FC101"
    facilityCode: {
      type: String,
      required: true,
    },

    // The rating given to the facility
    // It must be a number between 1 and 5
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Optional written comment about the facility
    comment: {
      type: String,
    },

    // Optional reference to the User who submitted the review
    // ObjectId is MongoDB's ID type
    // ref: 'User' tells Mongoose this ID refers to a User document
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },

  // Automatically adds createdAt and updatedAt fields
  {
    timestamps: true,
  }
);

// A user can only review the same facility once.
//
// Together, facilityCode + reviewedBy must be unique.
//
// Example:
// FC101 + UserA  -> allowed
// FC101 + UserA  -> NOT allowed again
// FC101 + UserB  -> allowed
//
// This is a compound unique index because uniqueness depends
// on TWO fields together.
reviewSchema.index(
  { facilityCode: 1, reviewedBy: 1 },
  { unique: true }
);

// Create and export the Review model
module.exports = mongoose.model('Review', reviewSchema);