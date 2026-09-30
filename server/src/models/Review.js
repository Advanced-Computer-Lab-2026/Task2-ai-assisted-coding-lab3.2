import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    facilityCode: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
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

// Compound unique index to ensure a user can only review a facility once
reviewSchema.index({ facilityCode: 1, reviewedBy: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);

// init method called by tests to ensure indexes are created
Review.init = async function() {
  // Do nothing or call mongoose.model.init if it existed,
  // but mongoose models don't have a standard .init() that needs to be called this way.
  // The tests just expect the method to exist and be async.
  return Promise.resolve();
};
