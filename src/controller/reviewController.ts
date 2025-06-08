import { Request, Response } from "express";
import Review from "../database/model/reviewModel";
import User from "../database/model/userModel";

interface IAuth extends Request {
  user?: {
    id: string;
  };
}

class ReviewController {
  async postReview(req: IAuth, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      res.status(400).json({
        message: "Rating and comment are required",
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
      return;
    }

    const data = await Review.create({
      rating,
      comment,
      productId: id,
      userId,
    });

    res.status(200).json({
      message: "Review posted successfully",
      data,
    });
  }

  async getAllReviews(req: Request, res: Response): Promise<void> {
    const data = await Review.findAll();

    if (data.length === 0) {
      res.status(404).json({
        message: "No reviews found",
      });
      return;
    }

    res.status(200).json({
      message: "Reviews retrieved successfully",
      data,
    });
  }

  async getReviewByProductId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const data = await Review.findAll({
      where: { productId: id },
      include: [
        {
          model: User,
          attributes: [ "username"],
        },
      ],
    });

    if (data.length === 0) {
      res.status(404).json({
        message: "No reviews found for this product",
      });
      return;
    }

    res.status(200).json({
      message: "Reviews retrieved successfully",
      data,
    });
  }

  async deleteReview(req: IAuth, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { id } = req.params;

    // User can only delete their own review
    const review = await Review.findOne({
      where: { id, userId },
    });

    if (!review) {
      res.status(404).json({
        message:
          "Review not found or you do not have permission to delete this review",
      });
      return;
    }

    await Review.destroy({
      where: { id, userId },
    });

    res.status(200).json({
      message: "Review deleted successfully",
    });
  }

  async updateReview(req: IAuth, res: Response): Promise<void> {
    const userId = req.user!.id; // guaranteed by middleware
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      res.status(400).json({
        message: "Rating and comment are required",
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
      return;
    }

    // User can only update their own review
    const review = await Review.findOne({
      where: { id, userId },
    });

    if (!review) {
      res.status(404).json({
        message:
          "Review not found or you do not have permission to update this review",
      });
      return;
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      data: review,
    });
  }
}

export default new ReviewController();
