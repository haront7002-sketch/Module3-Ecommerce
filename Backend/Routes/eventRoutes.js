import express from 'express';
import { getEventsCon, getEventByIdCon } from '../Controllers/eventController.js';
   
const router = express.Router();

router.get('/events', getEventsCon);
router.get('/events/:id', getEventByIdCon);

export { router as eventRoutes };
