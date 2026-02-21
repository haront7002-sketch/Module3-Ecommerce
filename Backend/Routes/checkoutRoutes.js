import express from 'express';
import { postCheckoutCon } from '../Controllers/checkoutController.js';

const router = express.Router();

router.post('/checkout', postCheckoutCon);

export { router as checkoutRoutes };
