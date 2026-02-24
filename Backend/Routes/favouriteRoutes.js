import express from 'express';
import { getFavouritesCon, postFavouriteCon, deleteFavouriteCon } from '../Controllers/favouriteController.js';

const router = express.Router();

router.get('/favourites/:user_id', getFavouritesCon);
router.get('/favourites', getFavouritesCon);
router.post('/favourites', postFavouriteCon);
router.delete('/favourites', deleteFavouriteCon);

export { router as favouriteRoutes };
