import express from 'express';
import { getOrderByIdCon, getUserOrdersCon, patchOrderStatusCon, postCheckoutCon } from '../Controllers/orderController.js';

const router = express.Router();

// SECTION: Checkout endpoint
router.post('/checkout', postCheckoutCon);

// SECTION: Order query/update endpoints
router.get('/orders/:order_id', getOrderByIdCon);
router.get('/users/:user_id/orders', getUserOrdersCon);
router.patch('/orders/:order_id/status', patchOrderStatusCon);

export { router as orderRoutes };
