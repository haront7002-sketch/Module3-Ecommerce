import express from 'express';
import { getOrderTicketsCon, postIssueTicketsCon, postIssueAllTicketsCon } from '../Controllers/ticketController.js';

const router = express.Router();

router.get('/orders/:order_id/tickets', getOrderTicketsCon);
router.post('/orders/:order_id/tickets/issue', postIssueTicketsCon);
router.post('/tickets/issue-all', postIssueAllTicketsCon);

export { router as ticketRoutes };
