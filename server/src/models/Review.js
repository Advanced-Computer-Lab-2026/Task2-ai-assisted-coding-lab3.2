import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    facilityCode: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// One review per (facility, user). The partial filter keeps anonymous reviews
// (no reviewedBy) from colliding with each other, since a missing field would
// otherwise be indexed as null and only one anonymous review per facility allowed.
reviewSchema.index(
  { facilityCode: 1, reviewedBy: 1 },
  { unique: true, partialFilterExpression: { reviewedBy: { $exists: true } } }
);

export const Review = mongoose.model('Review', reviewSchema);