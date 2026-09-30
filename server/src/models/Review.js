import mongoose from 'mongoose';

// TODO: define the Review schema per README.md section 1.

const reviewSchema = new mongoose.Schema(
  {
    facilityCode: {
      type: String,
      required: [true, 'facilityCode is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'rating is required'],
      min: [1, 'rating must be at least 1'],
      max: [5, 'rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// TODO: add the compound uniqueness constraint described in README.md section 1.
reviewSchema.index({ facilityCode: 1, reviewedBy: 1 }, { unique: true });
export const Review = mongoose.model('Review', reviewSchema);
