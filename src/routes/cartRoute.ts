import express,{ Router } from "express";
import middleware, { Role } from "../services/middleware";
import errorHandler from "../services/errorHandler";
import cartController from "../controller/cartController";


const router:Router= express.Router()


router.route('/').post(middleware.isUserLoggedIn,errorHandler(cartController.postCart)).get(middleware.isUserLoggedIn,errorHandler(cartController.getCart))
export default  router