import express, { Router } from "express";
import middleware, { Role } from "../services/middleware";
import errorHandler from "../services/errorHandler";
import cartController from "../controller/cartController";
import userController from "../controller/userController";

const router: Router = express.Router();

router
  .route("/")
  .post(middleware.isUserLoggedIn, errorHandler(cartController.postCart))
  .get(middleware.isUserLoggedIn, errorHandler(cartController.getCart));
router
  .route("/:productId")
  .patch(
    middleware.isUserLoggedIn,

    errorHandler(cartController.updateCart)
  )
  .delete(
    middleware.isUserLoggedIn,

    errorHandler(cartController.deleteCart)
  );
export default router;
