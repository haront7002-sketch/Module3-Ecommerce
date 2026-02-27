import {
    buildTicketsFromOrderRows,
    getOrderTicketRowsDb,
    getAllOrderTicketRowsDb,
    patchOrderTicketsIssuedDb,
    patchAllOrdersTicketsIssuedDb
} from '../Models/ticketModel.js';

// SECTION: Issue tickets for an order and update order status
const postIssueTicketsCon = async (req, res) => {
    try {
        const { order_id } = req.params;

        const order_rows = await getOrderTicketRowsDb(order_id);
        if (!order_rows.length) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        const tickets = buildTicketsFromOrderRows(order_rows);
        await patchOrderTicketsIssuedDb(order_id);

        return res.status(200).json({
            message: 'Tickets issued successfully',
            order_id: Number(order_id),
            ticket_count: tickets.length,
            tickets
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error issuing tickets',
            error: error.message
        });
    }
};

// SECTION: Get ticket payload for an order without updating status
const getOrderTicketsCon = async (req, res) => {
    try {
        const { order_id } = req.params;

        const order_rows = await getOrderTicketRowsDb(order_id);
        if (!order_rows.length) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        const tickets = buildTicketsFromOrderRows(order_rows);

        return res.status(200).json({
            order_id: Number(order_id),
            ticket_count: tickets.length,
            tickets
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching tickets',
            error: error.message
        });
    }
};

// SECTION: Issue tickets for all orders/events (optionally scoped to one user)
const postIssueAllTicketsCon = async (req, res) => {
    try {
        const { user_id } = req.body || {};
        const parsedUserId = user_id === undefined ? null : Number(user_id);

        if (user_id !== undefined && (!Number.isInteger(parsedUserId) || parsedUserId <= 0)) {
            return res.status(400).json({
                message: 'user_id must be a positive integer when provided'
            });
        }

        const order_rows = await getAllOrderTicketRowsDb(parsedUserId);
        if (!order_rows.length) {
            return res.status(404).json({
                message: 'No orders found to issue tickets for'
            });
        }

        const tickets = buildTicketsFromOrderRows(order_rows);
        await patchAllOrdersTicketsIssuedDb(parsedUserId);

        const uniqueOrderCount = new Set(order_rows.map((row) => row.order_id)).size;

        return res.status(200).json({
            message: 'Tickets issued successfully for all matching orders',
            user_id: parsedUserId,
            order_count: uniqueOrderCount,
            ticket_count: tickets.length,
            tickets
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error issuing tickets for all orders',
            error: error.message
        });
    }
};

export { postIssueTicketsCon, getOrderTicketsCon, postIssueAllTicketsCon };
