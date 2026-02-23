import express from 'express';
import { getOrderTicketsCon, postIssueTicketsCon } from '../Controllers/ticketController.js';

const router = express.Router();

// SECTION: Ticket endpoints
router.get('/orders/:order_id/tickets', getOrderTicketsCon);
router.post('/orders/:order_id/tickets/issue', postIssueTicketsCon);

export { router as ticketRoutes };
