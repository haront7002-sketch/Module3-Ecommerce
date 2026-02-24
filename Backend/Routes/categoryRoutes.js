import express from 'express';
import { getCategoriesCon, getCategoryCon, postCategoryCon, patchCategoryCon, deleteCategoryCon } from '../Controllers/categoryController.js';

const router = express.Router();

// GET /api/categories - list all categories
router.get('/categories', getCategoriesCon);

// GET /api/categories/:category_id - single category
router.get('/categories/:category_id', getCategoryCon);

// POST /api/categories - create category
router.post('/categories', postCategoryCon);

// PATCH /api/categories/:category_id - update category name
router.patch('/categories/:category_id', patchCategoryCon);

// DELETE /api/categories/:category_id - delete category
router.delete('/categories/:category_id', deleteCategoryCon);

export { router as categoryRoutes };
