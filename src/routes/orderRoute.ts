import express,{ Router } from "express";
import errorHandler from "../services/errorHandler";
import middleware, { Role } from "../services/middleware";
import orderController from "../controller/orderController";


const router:Router= express.Router()

router.route("/").post(middleware.isUserLoggedIn, errorHandler(orderController.postOrder)).get(middleware.isUserLoggedIn,errorHandler(orderController.fetchMyOrder))
router.route("/all").get( errorHandler(orderController.fetchAllOrders))

router.route("/verify-pidx").post(middleware.isUserLoggedIn,errorHandler(orderController.verifyTransaction))
router.route('/:id').get(errorHandler(orderController.fetchMyOrderDetail  ))
router.route("/admin/change-status/:id").patch(middleware.isUserLoggedIn,middleware.accessTo(Role.Admin), errorHandler(orderController.changeOrderStatus))
router.route("/admin/delete-order/:id").post(middleware.isUserLoggedIn,middleware.accessTo(Role.Admin), errorHandler(orderController.deleteOrder))
router.route("/cancel-order/:id").patch(middleware.isUserLoggedIn,middleware.accessTo(Role.Customer), errorHandler(orderController.cancelOrder))

export default router