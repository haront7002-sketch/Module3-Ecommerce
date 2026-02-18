import {db} from '../Config/database.js'

const postFavouritesDb = async (user_id, event_id) => {
    const [result] = await db.query(
        'INSERT INTO favourites (user_id, event_id, created_at) VALUES (?, ?, UNIX_TIMESTAMP())',
        [user_id, event_id]
    );
    return result;
    
};


const checkFavouritesDb = async (user_id, event_id) => {
    const [rows] = await db.query(
        'SELECT * FROM favourites WHERE user_id = ? AND event_id = ?',
        [user_id, event_id]
    );
    return rows;
};

const getUserFavouritesDb = async (user_id) => {
    const [rows] = await db.query(`
        SELECT f.*, e.event_title, e.description, e.date, e.location, e.price, e.image_url 
        FROM favourites f
        JOIN events e ON f.event_id = e.event_id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC
    `, [user_id]);
    return rows;
};

export { postFavouritesDb, checkFavouritesDb, getUserFavouritesDb };
