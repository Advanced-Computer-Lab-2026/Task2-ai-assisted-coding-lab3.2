# Plan: Implement Review Summary Functionality

## Goal
Implement the `GET /api/reviews/summary` endpoint to provide aggregation of ratings for a specific facility.

## Analysis of Current State
- **Route Conflict**: In `src/routes/reviews.js`, `router.get('/:id', ...)` is defined before any potential summary route. Since `:id` is a wildcard, it matches "summary", causing the request to be handled by `getReview` instead of a summary handler, leading to a 500 error (likely due to `findById` failing with the string "summary").
- **Missing Controller Logic**: `src/controllers/reviewController.js` does not have a `getSummary` function.
- **Schema**: `Review` model has `facilityCode` (String) and `rating` (Number).

## Proposed Implementation

### 1. Route Configuration (`src/routes/reviews.js`)
Move the summary route *above* the `:id` route to ensure it is matched first.
```javascript
router.get('/summary', reviewController.getSummary);
router.get('/:id', reviewController.getReview);
```

### 2. Controller Logic (`src/controllers/reviewController.js`)
Implement `getSummary` with the following requirements:
- **Validation**: Check for `facilityCode` in `req.query`. If missing, return 400 `{ message: 'facilityCode is required' }`.
- **Aggregation**: Use MongoDB aggregation pipeline:
    - `$match`: Filter by `facilityCode`.
    - `$group`: Calculate `$avg` of `rating` and `$sum` of 1 for `reviewCount`.
- **Fallback**: If no reviews are found, return `{ facilityCode, averageRating: 0, reviewCount: 0 }`.

Example Logic:
```javascript
export async function getSummary(req, res, next) {
  try {
    const { facilityCode } = req.query;
    if (!facilityCode) {
      return res.status(400).json({ message: 'facilityCode is required' });
    }

    const summary = await Review.aggregate([
      { $match: { facilityCode } },
      { 
        $group: { 
          _id: '$facilityCode', 
          averageRating: { $avg: '$rating' }, 
          reviewCount: { $sum: 1 } 
        } 
      }
    ]);

    if (summary.length === 0) {
      return res.json({ 
        facilityCode, 
        averageRating: 0, 
        reviewCount: 0 
      });
    }

    const result = summary[0];
    res.json({
      facilityCode: result._id,
      averageRating: result.averageRating,
      reviewCount: result.reviewCount
    });
  } catch (err) { next(err); }
}
```

## Verification Plan
- Verify the route order change fixes the 500 error.
- Test with a valid `facilityCode` that has reviews.
- Test with a `facilityCode` that has no reviews (expect zeros).
- Test without `facilityCode` query param (expect 400).
