import db from '../Config/database.js';

let cachedUserColumns = null;

const getUserColumns = async () => {
    if (cachedUserColumns) return cachedUserColumns;

    const [rows] = await db.execute(`SHOW COLUMNS FROM users`);
    cachedUserColumns = new Set(rows.map((row) => row.Field));
    return cachedUserColumns;
};

const User = {

    // Create user
    create: async (userData) => {
        const {
            user_name,
            user_surname,
            email,
            password,
            country,
            zip_code,
            area
        } = userData;

        const columns = await getUserColumns();

        let insertSql = '';
        let values = [];

        if (columns.has('country') && columns.has('zip_code')) {
            if (columns.has('created_at')) {
                insertSql = `INSERT INTO users (user_name, user_surname, email, password, country, zip_code, created_at)
                             VALUES (?, ?, ?, ?, ?, ?, NOW())`;
                values = [user_name, user_surname, email, password, country || '', zip_code || ''];
            } else {
                insertSql = `INSERT INTO users (user_name, user_surname, email, password, country, zip_code)
                             VALUES (?, ?, ?, ?, ?, ?)`;
                values = [user_name, user_surname, email, password, country || '', zip_code || ''];
            }
        } else if (columns.has('area')) {
            insertSql = `INSERT INTO users (user_name, user_surname, email, password, area)
                         VALUES (?, ?, ?, ?, ?)`;
            values = [user_name, user_surname, email, password, area || zip_code || country || 'Unknown'];
        } else {
            throw new Error('users table is missing required location columns');
        }

        const [result] = await db.execute(insertSql, values);

        return {
             user_id: result.insertId,
            email
        };
    },

    // Find user by email
    findByEmail: async (email) => {
        const [rows] = await db.execute(
            `SELECT * FROM users WHERE LOWER(email) = ?`,
            [email]
        );

        return rows[0];
    },

    // Find user by id (without password)
    findById: async (user_id) => {
        const columns = await getUserColumns();

        const selectFields = ['user_id', 'user_name', 'user_surname', 'email'];
        if (columns.has('country')) selectFields.push('country');
        if (columns.has('zip_code')) selectFields.push('zip_code');
        if (columns.has('area')) selectFields.push('area');
        if (columns.has('created_at')) selectFields.push('created_at');

        const [rows] = await db.execute(
            `SELECT ${selectFields.join(', ')}
             FROM users
             WHERE user_id = ?`,
            [user_id]
        );

        return rows[0];
    },

    // Update user location fields (supports different schema variants)
    updateUser: async (user_id, { country, zip_code, area }) => {
        const columns = await getUserColumns();
        const updates = [];
        const values = [];

        if (columns.has('country') && country !== undefined) {
            updates.push('country = ?');
            values.push(country);
        }

        if (columns.has('zip_code') && zip_code !== undefined) {
            updates.push('zip_code = ?');
            values.push(zip_code);
        }

        if (columns.has('area') && area !== undefined) {
            updates.push('area = ?');
            values.push(area);
        }

        if (updates.length === 0) {
            return User.findById(user_id);
        }

        values.push(user_id);
        await db.execute(
            `UPDATE users
             SET ${updates.join(', ')}
             WHERE user_id = ?`,
            values
        );

        return User.findById(user_id);
    },

    // Update preferences payload
    updatePreferences: async (user_id, preferences) => {
        await db.execute(
            `UPDATE users
             SET preferences = ?
             WHERE user_id = ?`,
            [JSON.stringify(preferences), user_id]
        );

        return { user_id, preferences };
    },

};

export default User;
