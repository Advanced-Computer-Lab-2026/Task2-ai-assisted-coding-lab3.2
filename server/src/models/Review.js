import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    facilityCode: {
      type: String,
      required: [true, 'facilityCode is required'],
    },
    rating: {
      type: Number,
      required: [true, 'rating is required'],
      min: [1, 'rating must be at least 1'],
      max: [5, 'rating must be at most 5'],
    },
    comment: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Compound unique index: one review per user per facility
reviewSchema.index({ facilityCode: 1, reviewedBy: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
