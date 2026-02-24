import express from 'express';
import { getCartCon, postCartCon, patchCartQuantityCon, deleteCartCon, deleteUserCartCon } from '../Controllers/cartController.js';

const router = express.Router();

router.get('/cart/:user_id', getCartCon);
router.get('/cart', getCartCon);
router.post('/cart', postCartCon);
router.patch('/cart/:cart_id', patchCartQuantityCon);
router.delete('/cart/:cart_id', deleteCartCon);
router.delete('/cart/user/:user_id', deleteUserCartCon);

export {router as cartRoutes};
