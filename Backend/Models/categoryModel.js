import { db } from '../Config/database.js';

// Get all categories
const getCategoriesDb = async () => {
    const [rows] = await db.query(
        'SELECT category_id, category_name FROM categories ORDER BY category_id ASC'
    );
    return rows;
};

// Get single category by id
const getCategoryDb = async (category_id) => {
    const [rows] = await db.query(
        'SELECT category_id, category_name FROM categories WHERE category_id = ?',
        [category_id]
    );
    return rows[0];
};

// Create category (note: category_id is not AUTO_INCREMENT in SOS.sql)
const postCategoryDb = async (category_id, category_name) => {
    const [result] = await db.query(
        'INSERT INTO categories (category_id, category_name) VALUES (?, ?)',
        [category_id, category_name]
    );
    return result;
};

// Update category name
const patchCategoryDb = async (category_id, category_name) => {
    const [result] = await db.query(
        'UPDATE categories SET category_name = ? WHERE category_id = ?',
        [category_name, category_id]
    );
    return result;
};

// Delete category
const deleteCategoryDb = async (category_id) => {
    const [result] = await db.query(
        'DELETE FROM categories WHERE category_id = ?',
        [category_id]
    );
    return result;
};

export { getCategoriesDb, getCategoryDb, postCategoryDb, patchCategoryDb, deleteCategoryDb };
