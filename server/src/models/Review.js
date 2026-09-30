import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  facilityCode: {
    type: String,
    required: true,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound unique index on facilityCode and reviewedBy
reviewSchema.index({ facilityCode: 1, reviewedBy: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export { Review };
export default Review;
