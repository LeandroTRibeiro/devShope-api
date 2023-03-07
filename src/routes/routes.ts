import { Request, Response, Router } from "express";

import * as CategoryController from '../controllers/CategoryController';
import * as UserController from '../controllers/UserController';
import * as AuthController from '../controllers/AuthController';
import * as AdsController from '../controllers/AdsController';
import * as AuthMiddlewares from '../middlewares/Auth';
import * as WishListController from '../controllers/WishListController';
import * as BannerController from '../controllers/BannerController';
import * as CartListController from '../controllers/CartListController';

import { AuthValidator } from "../validators/AuthValidator";
import { UserValidator } from "../validators/UserValidator";
import { upload } from "../middlewares/Multer";
import { AddressValidator } from "../validators/AddressValidator";

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({pong: true});
});

router.post('/user/signin', AuthValidator.signin, AuthController.Signin);
router.post('/user/signin/token', AuthMiddlewares.privateRoute, AuthController.tokenSignin)
router.post('/user/signup', AuthValidator.signup, AuthController.Signup);
router.post('/user/accountauthentication', AuthController.AccountAuthentication);
router.post('/user/recoverpassword', AuthController.RecoverPassword);
router.post('/user/updatepassword', AuthValidator.updatePassword, AuthController.UpdatePassword);
router.post('/user/info', AuthMiddlewares.privateRoute, UserController.UserInfo);

router.post('/user/add/address', AddressValidator.addAddress, AuthMiddlewares.privateRoute, UserController.AddAddress);
router.post('/user/address', AuthMiddlewares.privateRoute, UserController.AddressInfo);

router.post('/user/add/wish', AuthMiddlewares.privateRoute, WishListController.addAndRemoveWish);
router.post('/user/show/wishlist', AuthMiddlewares.privateRoute, WishListController.getWishs);
router.post('/user/show/wishproducts', AuthMiddlewares.privateRoute, WishListController.getWishListProducts);

router.post('/cart/add', AuthMiddlewares.privateRoute, CartListController.addToCart);
router.post('/cart/get', AuthMiddlewares.privateRoute, CartListController.getCart);
router.post('/cart/show/cartproducts', AuthMiddlewares.privateRoute, CartListController.getProductCart);
router.post('/cart/del', AuthMiddlewares.privateRoute, CartListController.deleteToCart);

router.get('/banner', BannerController.getBanners);

router.put('/user/edit/info', UserValidator.editInfo, AuthMiddlewares.privateRoute, UserController.EditUserInfo);
router.put('/user/edit/address', AddressValidator.editAddress, AuthMiddlewares.privateRoute, UserController.EditAddressInfo);

router.get('/getcategories', CategoryController.getCategories);

router.get('/ad/getlist', AdsController.getList);
router.post('/ad/:id', AdsController.getItem);
router.post('/delivery/price', AdsController.getDeliveryPrice);
// router.post('/ad/add', AuthMiddlewares.privateRoute, upload.array('avatars', 4), AdsController.add);
// router.post('/ad/:id', AuthMiddlewares.privateRoute, upload.array('avatars', 4), AdsController.edit);

export default router;
