

import express from 'express';
import errorHandler from '../services/errorHandler';
import userController from '../controller/userController';
const router= express.Router()

router.route('/register').post(errorHandler(userController.registerUser))
router.route('/login').post(errorHandler(userController.loginUser))
router.route('/send-otp').post(errorHandler(userController.forgotPassword))
router.route('/reset-password').post(errorHandler(userController.resetPassword))


export default router;