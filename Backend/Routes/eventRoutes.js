import express from 'express';
import { getEventsCon, getEventByIdCon, getEventsByCategoryCon, postEventCon, patchEventCon, deleteEventCon } from '../Controllers/eventController.js';
   
const router = express.Router();

router.get('/events', getEventsCon);
router.get('/events/:event_id', getEventByIdCon);
router.get('/categories/:category_id/events', getEventsByCategoryCon);
router.post('/events', postEventCon);
router.patch('/events/:event_id', patchEventCon);
router.delete('/events/:event_id', deleteEventCon);

export { router as eventRoutes };
