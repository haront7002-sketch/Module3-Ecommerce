import db from '../Config/database.js';

const User = {

    // Create user
    create: async (userData) => {
        const {
            user_name,
            user_surname,
            email,
            password,
            country,
            zip_code
        } = userData;

        const [result] = await db.execute(
            `INSERT INTO users 
            (user_name, user_surname, email, password, country, zip_code, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [user_name, user_surname, email, password, country, zip_code]
        );

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
        const [rows] = await db.execute(
            `SELECT user_id, user_name, user_surname, email, country, zip_code, created_at
             FROM users
             WHERE user_id = ?`,
            [user_id]
        );

        return rows[0];
    },

    // Update country and zip code
    updateUser: async (user_id, { country, zip_code }) => {
        await db.execute(
            `UPDATE users
             SET country = ?, zip_code = ?
             WHERE user_id = ?`,
            [country, zip_code, user_id]
        );

        return { user_id, country, zip_code };
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
