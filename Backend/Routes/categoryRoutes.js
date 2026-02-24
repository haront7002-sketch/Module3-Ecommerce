import express from 'express';
import { getCategoriesCon, getCategoryCon, postCategoryCon, patchCategoryCon, deleteCategoryCon } from '../Controllers/categoryController.js';

const router = express.Router();

router.get('/categories', getCategoriesCon);
router.get('/categories/:category_id', getCategoryCon);
router.post('/categories', postCategoryCon);
router.patch('/categories/:category_id', patchCategoryCon);
router.delete('/categories/:category_id', deleteCategoryCon);

export { router as categoryRoutes };
