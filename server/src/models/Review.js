import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  facilityCode: {
    type: String,
    required: [true, 'Facility code is required'],
    trim: true,
  },

  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },

  comment: {
    type: String,
    trim: true,
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true
});

// Compound unique index: a user can only review a facility once
reviewSchema.index(
  { facilityCode: 1, reviewedBy: 1 },
  { unique: true }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;