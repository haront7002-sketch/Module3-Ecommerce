import {
    getEventsDb,
    getEventByIdDb,
    getEventsByCategoryDb,
    postEventDb,
    patchEventDb,
    deleteEventDb
} from '../Models/eventModel.js';

// GET /events
const getEventsCon = async (req, res) => {
    try {
        const events = await getEventsDb();
        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: error });
    }
};

// GET /events/:event_id
const getEventByIdCon = async (req, res) => {
    try {
        const { event_id } = req.params;
        const event = await getEventByIdDb(event_id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ event });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Error fetching event' });
    }
};

// GET /categories/:category_id/events
const getEventsByCategoryCon = async (req, res) => {
    try {
        const { category_id } = req.params;
        const events = await getEventsByCategoryDb(category_id);
        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching events by category:', error);
        res.status(500).json({ message: 'Error fetching events by category' });
    }
};

// POST /events
const postEventCon = async (req, res) => {
    try {
        const {
            event_title,
            description,
            date,
            time,
            location,
            price,
            image_url,
            category_id
        } = req.body;

        if (!event_title || !description || !date || !time || !location || price === undefined || !category_id) {
            return res.status(400).json({
                message: 'event_title, description, date, time, location, price, and category_id are required'
            });
        }

        const result = await postEventDb({
            event_title,
            description,
            date,
            time,
            location,
            price,
            image_url,
            category_id
        });

        res.status(201).json({
            message: 'Event created',
            event_id: result.insertId
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: error.message });
    }
};

// PATCH /events/:event_id
const patchEventCon = async (req, res) => {
    try {
        const { event_id } = req.params;
        const updates = req.body || {};

        const result = await patchEventDb(event_id, updates);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found or no changes' });
        }

        res.status(200).json({ message: 'Event updated' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error updating event' });
    }
};

// DELETE /events/:event_id
const deleteEventCon = async (req, res) => {
    try {
        const { event_id } = req.params;

        const result = await deleteEventDb(event_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event' });
    }
};

export {
    getEventsCon,
    getEventByIdCon,
    getEventsByCategoryCon,
    postEventCon,
    patchEventCon,
    deleteEventCon
};
