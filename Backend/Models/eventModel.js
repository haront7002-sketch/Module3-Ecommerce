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

// Create event
const postEventDb = async (eventData) => {
    const {
        event_title,
        description,
        date,
        time,
        location,
        price,
        image_url,
        category_id
    } = eventData;

    const [result] = await db.query(
        `INSERT INTO events
         (event_title, description, date, time, location, price, image_url, category_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [event_title, description, date, time, location, price, image_url || null, category_id]
    );

    return result;
};

// Update event (partial)
const patchEventDb = async (event_id, updates) => {
    const fields = [];
    const values = [];

    if (updates.event_title !== undefined) {
        fields.push('event_title = ?');
        values.push(updates.event_title);
    }
    if (updates.description !== undefined) {
        fields.push('description = ?');
        values.push(updates.description);
    }
    if (updates.date !== undefined) {
        fields.push('date = ?');
        values.push(updates.date);
    }
    if (updates.time !== undefined) {
        fields.push('time = ?');
        values.push(updates.time);
    }
    if (updates.location !== undefined) {
        fields.push('location = ?');
        values.push(updates.location);
    }
    if (updates.price !== undefined) {
        fields.push('price = ?');
        values.push(updates.price);
    }
    if (updates.image_url !== undefined) {
        fields.push('image_url = ?');
        values.push(updates.image_url);
    }
    if (updates.category_id !== undefined) {
        fields.push('category_id = ?');
        values.push(updates.category_id);
    }

    if (fields.length === 0) {
        return { affectedRows: 0 };
    }

    values.push(event_id);
    const [result] = await db.query(
        `UPDATE events SET ${fields.join(', ')} WHERE event_id = ?`,
        values
    );
    return result;
};

// Delete event
const deleteEventDb = async (event_id) => {
    const [result] = await db.query(
        'DELETE FROM events WHERE event_id = ?',
        [event_id]
    );
    return result;
};

export {
    getEventsDb,
    getEventByIdDb,
    getEventsByCategoryDb,
    postEventDb,
    patchEventDb,
    deleteEventDb
};
