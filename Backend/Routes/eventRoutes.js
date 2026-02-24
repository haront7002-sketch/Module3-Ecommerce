import express from 'express';
import {
    getEventsCon,
    getEventByIdCon,
    getEventsByCategoryCon,
    postEventCon,
    patchEventCon,
    deleteEventCon
} from '../Controllers/eventController.js';

const router = express.Router();

// GET /api/events - list all events
router.get('/events', getEventsCon);

// GET /api/events/:event_id - single event
router.get('/events/:event_id', getEventByIdCon);

// GET /api/categories/:category_id/events - events by category
router.get('/categories/:category_id/events', getEventsByCategoryCon);

// POST /api/events - create event
router.post('/events', postEventCon);

// PATCH /api/events/:event_id - update event
router.patch('/events/:event_id', patchEventCon);

// DELETE /api/events/:event_id - delete event
router.delete('/events/:event_id', deleteEventCon);

export { router as eventRoutes };
