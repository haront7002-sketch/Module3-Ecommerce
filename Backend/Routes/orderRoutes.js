import express from 'express';
import { getOrderCon, getUserOrdersCon, patchOrderStatusCon, postCheckoutCon, postOrderCon, postOrderItemsCon } from '../Controllers/orderController.js';

const router = express.Router();

router.post('/checkout', postCheckoutCon);
router.post('/orders', postOrderCon);
router.post('/orders/items', postOrderItemsCon);
router.get('/orders/:order_id', getOrderCon);
router.get('/users/:user_id/orders', getUserOrdersCon);
router.patch('/orders/:order_id/status', patchOrderStatusCon);

export { router as orderRoutes };
