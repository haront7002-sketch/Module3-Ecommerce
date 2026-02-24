import db from '../Config/database.js';

const User = {

    // CREATE USER
    create: async (userData) => {
        const { user_name, user_surname, email, password, country, zip_code } = userData;

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

    // FIND USER BY EMAIL
    findByEmail: async (email) => {
        const [rows] = await db.execute(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        return rows[0];
    },

    // FIND USER BY ID
    findById: async (user_id) => {
        const [rows] = await db.execute(
            `SELECT user_id, user_name, user_surname, email, country, zip_code, preferences 
             FROM users 
             WHERE user_id = ?`,
            [user_id]
        );

        return rows[0];
    },

    //  UPDATE USER COUNTRY / ZIP
    updateUser: async (user_id, { country, zip_code }) => {
        await db.execute(
            `UPDATE users 
             SET country = ?, zip_code = ? 
             WHERE user_id = ?`,
            [country, zip_code, user_id]
        );

        return { user_id, country, zip_code };
    },

    // UPDATE USER PREFERENCES
    updatePreferences: async (user_id, preferences) => {
        await db.execute(
            `UPDATE users 
             SET preferences = ? 
             WHERE user_id = ?`,
            [preferences, user_id]
        );

        return { user_id, preferences };
    }

};

export default User;