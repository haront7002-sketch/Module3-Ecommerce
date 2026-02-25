import { db } from '../Config/database.js';

// Get all events
const getEventsDb = async () => {
    const [rows] = await db.query(
        `SELECT event_id,
                event_title,
                description,
                DATE_FORMAT(\`date\`, '%Y-%m-%d') AS date,
                TIME_FORMAT(\`time\`, '%H:%i:%s') AS time,
                location,
                price,
                image_url,
                category_id,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
         FROM events
         ORDER BY \`date\` ASC, \`time\` ASC`
    );
    return rows;
};

// Get single event by id
const getEventByIdDb = async (event_id) => {
    const [rows] = await db.query(
        `SELECT event_id,
                event_title,
                description,
                DATE_FORMAT(\`date\`, '%Y-%m-%d') AS date,
                TIME_FORMAT(\`time\`, '%H:%i:%s') AS time,
                location,
                price,
                image_url,
                category_id,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
         FROM events
         WHERE event_id = ?`,
        [event_id]
    );
    return rows[0];
};

// Get events by category
const getEventsByCategoryDb = async (category_id) => {
    const [rows] = await db.query(
        `SELECT event_id,
                event_title,
                description,
                DATE_FORMAT(\`date\`, '%Y-%m-%d') AS date,
                TIME_FORMAT(\`time\`, '%H:%i:%s') AS time,
                location,
                price,
                image_url,
                category_id,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
         FROM events
         WHERE category_id = ?
         ORDER BY \`date\` ASC, \`time\` ASC`,
        [category_id]
    );
    return rows;
};

export {
    getEventsDb,
    getEventByIdDb,
    getEventsByCategoryDb
};
