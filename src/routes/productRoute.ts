
import express,{Router} from 'express';

import errorHandler from '../services/errorHandler';
import userController from '../controller/userController';
import middleware, { Role } from '../services/middleware';
import productController from '../controller/productController';
import { upload } from '../services/multer';
const router:Router= express.Router();


router.route('/').post(upload.array('image',5),middleware.isUserLoggedIn,errorHandler(productController.postProduct)).get(errorHandler(productController.getProducts))
router.route('/:id').delete(middleware.isUserLoggedIn,middleware.accessTo(Role.Admin),errorHandler(productController.deleteProduct)).patch(upload.array('image',5),middleware.isUserLoggedIn,middleware.accessTo(Role.Admin),errorHandler(productController.updateProduct)).get(errorHandler(productController.getProductById))
export default router;