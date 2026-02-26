import express from 'express';
import { postPreferencesCon } from '../Controllers/preferenceController.js';

const router = express.Router();

router.post('/preferences', postPreferencesCon);

export { router as preferenceRoutes };

