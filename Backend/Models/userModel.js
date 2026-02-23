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
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );

        return rows[0];
    }

};

export default User;
