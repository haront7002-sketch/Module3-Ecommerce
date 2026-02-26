import { db } from '../Config/database.js';

let cachedUserCategoryTable = null;

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const getUserCategoryTableName = async () => {
  if (cachedUserCategoryTable) return cachedUserCategoryTable;

  const [pluralRows] = await db.query("SHOW TABLES LIKE 'user_categories'");
  if (pluralRows.length > 0) {
    cachedUserCategoryTable = 'user_categories';
    return cachedUserCategoryTable;
  }

  const [singularRows] = await db.query("SHOW TABLES LIKE 'user_category'");
  if (singularRows.length > 0) {
    cachedUserCategoryTable = 'user_category';
    return cachedUserCategoryTable;
  }

  throw new Error('user_categories/user_category table not found');
};

const getCategoryIdsFromInterestsDb = async (interests = []) => {
  if (!Array.isArray(interests) || interests.length === 0) return [];

  const normalizedInterests = new Set(interests.map((interest) => normalize(interest)).filter(Boolean));
  if (normalizedInterests.size === 0) return [];

  const [rows] = await db.query('SELECT category_id, category_name FROM categories');
  return rows
    .filter((row) => normalizedInterests.has(normalize(row.category_name)))
    .map((row) => Number(row.category_id))
    .filter((id) => Number.isInteger(id) && id > 0);
};

const saveUserPreferencesDb = async (user_id, categoryIds = []) => {
  const tableName = await getUserCategoryTableName();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(`DELETE FROM ${tableName} WHERE user_id = ?`, [user_id]);

    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      const uniqueCategoryIds = [...new Set(categoryIds)];
      const values = uniqueCategoryIds.map((categoryId) => [user_id, categoryId]);
      await connection.query(
        `INSERT INTO ${tableName} (user_id, category_id) VALUES ?`,
        [values]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export { getCategoryIdsFromInterestsDb, saveUserPreferencesDb };

