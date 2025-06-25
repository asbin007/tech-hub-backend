import express, { Router } from "express";
import middleware from "../services/middleware";
import errorHandler from "../services/errorHandler";
import reviewController from "../controller/reviewController";

const router: Router = express.Router();

// POST review and GET reviews by product ID
router
  .route('/')
  .post(middleware.isUserLoggedIn, errorHandler(reviewController.postReview))

  router.route('/:productId').get(errorHandler(reviewController.getReviewByProductId))

// GET all reviews
router.route('/').get(errorHandler(reviewController.getAllReviews));

// DELETE and PATCH review by ID (user must be logged in)
router
  .route('/:id')
  .delete(middleware.isUserLoggedIn, errorHandler(reviewController.deleteReview))
  .patch(middleware.isUserLoggedIn, errorHandler(reviewController.updateReview));

export default router;
