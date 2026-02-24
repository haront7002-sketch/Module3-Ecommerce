import { db } from "../Config/database.js";


// SECTION: Get all events (optional filter by category)
const getEvents = async (category) => {
    let query = "SELECT * FROM events";
    const params = [];

    if (category) {
        query += " WHERE category_id = ?";
        params.push(Number(category));
    }

    query += " ORDER BY date ASC";

    const [rows] = await db.query(query, params);
    return rows;
};


// SECTION: Get single event by ID
const getEventById = async (event_id) => {
    const [rows] = await db.query(
        "SELECT * FROM events WHERE event_id = ? LIMIT 1",
        [event_id]
    );

    return rows.length ? rows[0] : null;
};


export {
    getEvents,
    getEventById
};


  
