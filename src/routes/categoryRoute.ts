import express, { Router } from "express";
import categoryController from "../controller/categoryController";
import errorHandler from "../services/errorHandler";
import userController from "../controller/userController";
import  middleware, { Role } from "../services/middleware";
const router: Router = express.Router();

router
  .route("/")
  .get(errorHandler( categoryController.getCategories))
  .post(middleware.isUserLoggedIn,middleware.accessTo(Role.Admin), errorHandler(categoryController.addCategory));
router
  .route("/:id")
  .patch(middleware.isUserLoggedIn,middleware.accessTo(Role.Admin), errorHandler(categoryController.updateCategory))
  .delete(middleware.isUserLoggedIn,middleware.accessTo(Role.Admin), errorHandler(categoryController.deleteCategory));

export default router;
