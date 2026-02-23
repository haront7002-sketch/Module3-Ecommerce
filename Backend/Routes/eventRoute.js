import express from "express";
import { getEvents, getEventById } from "../Controllers/eventController.js";

const router = express.Router();

// Public event endpoints
router.get("/events", getEvents);
router.get("/events/:id", getEventById);

export default router;