import { getCategoriesDb, getCategoryDb, postCategoryDb, patchCategoryDb, deleteCategoryDb
} from '../Models/categoryModel.js';

// GET /categories
const getCategoriesCon = async (req, res) => {
    try {
        const categories = await getCategoriesDb();
        res.status(200).json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

// GET /categories/:category_id
const getCategoryCon = async (req, res) => {
    try {
        const { category_id } = req.params;
        const category = await getCategoryDb(category_id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ category });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Error fetching category' });
    }
};

// POST /categories
const postCategoryCon = async (req, res) => {
    try {
        const { category_id, category_name } = req.body;

        if (!category_id || !category_name) {
            return res.status(400).json({
                message: 'category_id and category_name are required'
            });
        }

        const result = await postCategoryDb(category_id, category_name);

        res.status(201).json({
            message: 'Category created',
            category_id: result.insertId || Number(category_id)
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: error.message });
    }
};

// PATCH /categories/:category_id
const patchCategoryCon = async (req, res) => {
    try {
        const { category_id } = req.params;
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({
                message: 'category_name is required'
            });
        }

        const result = await patchCategoryDb(category_id, category_name);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Error updating category' });
    }
};

// DELETE /categories/:category_id
const deleteCategoryCon = async (req, res) => {
    try {
        const { category_id } = req.params;

        const result = await deleteCategoryDb(category_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Error deleting category' });
    }
};

export { getCategoriesCon, getCategoryCon, postCategoryCon, patchCategoryCon, deleteCategoryCon };
