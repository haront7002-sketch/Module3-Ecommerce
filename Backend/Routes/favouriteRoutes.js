import express from 'express';
import { postFavouriteCon, getFavouritesCon } from '../Controllers/favouriteController.js';

const router = express.Router();

// POST /api/favourites - Add to favourites
router.post('/favourites', postFavouriteCon);

// GET /api/favourites/:user_id - Get user's favourites
router.get('/favourites/:user_id', getFavouritesCon);

export {router as favouriteRoutes};