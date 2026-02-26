import {
    getEventsDb,
    getEventByIdDb,
    getEventsByCategoryDb
} from '../Models/eventModel.js';

// GET /events
const getEventsCon = async (req, res) => {
    try {
        const { category } = req.query;
        const events = category
            ? await getEventsByCategoryDb(category)
            : await getEventsDb();
        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: error });
    }
};

// GET /events/:event_id
const getEventByIdCon = async (req, res) => {
    try {
        const eventId = req.params.id || req.params.event_id;
        const event = await getEventByIdDb(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ event });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Error fetching event' });
    }
};

export {
    getEventsCon,
    getEventByIdCon
};
