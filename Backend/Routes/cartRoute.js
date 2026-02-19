import express from 'express';
import { getCartCon, postCartCon, patchCartQuantityCon, deleteCartCon, deleteUserCartCon } from '../Controllers/cartController.js';

const router = express.Router();

// GET /api/cart/:user_id - Get user's cart
router.get('/cart/:user_id', getCartCon);

// POST /api/cart - Add to cart
router.post('/cart', postCartCon);

// PATCH /api/cart/:cart_id - Update cart quantity
router.patch('/cart/:cart_id', patchCartQuantityCon);

// DELETE /api/cart/:cart_id - Remove item from cart
router.delete('/cart/:cart_id', deleteCartCon);

// DELETE /api/cart/user/:user_id - Clear user cart
router.delete('/cart/user/:user_id', deleteUserCartCon);

export {router as cartRoutes};
