import {
    getEvents,
    getEventById
} from "../Models/eventModel.js";


// Get all events with optional category filter

const getEventsCon = async (req, res) => {
    try {
        const { category } = req.query;

        const events = await getEvents(category);

        if (!events.length) {
            return res.status(404).json({
                success: false,
                message: "No events found"
            });
        }

        return res.status(200).json({
            success: true,
            count: events.length,
            events
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching events",
            error: error.message
        });
    }
};


//  Get single event by ID
const getEventByIdCon = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await getEventById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            event
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching event",
            error: error.message
        });
    }
};


export {
    getEventsCon,
    getEventByIdCon
};