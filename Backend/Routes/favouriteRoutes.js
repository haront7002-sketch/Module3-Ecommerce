import express from 'express';
import { getFavouritesCon, postFavouriteCon, deleteFavouriteCon } from '../Controllers/favouriteController.js';

const router = express.Router();

// GET /api/favourites/:user_id - Get user's favourites
router.get('/favourites/:user_id', getFavouritesCon);

// POST /api/favourites - Add to favourites
router.post('/favourites', postFavouriteCon);

// DELETE /api/favourites - Remove from favourites
router.delete('/favourites', deleteFavouriteCon);

export { router as favouriteRoutes };
