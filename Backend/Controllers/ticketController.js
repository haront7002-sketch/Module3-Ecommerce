import { buildTicketsFromOrderRows, getOrderTicketRowsDb, patchOrderTicketsIssuedDb } from '../Models/ticketModel.js';

// SECTION: Issue tickets for an order and update order status
const postIssueTicketsCon = async (req, res) => {
    try {
        const { order_id } = req.params;

        const order_rows = await getOrderTicketRowsDb(order_id);
        if (!order_rows.length) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const tickets = buildTicketsFromOrderRows(order_rows);
        await patchOrderTicketsIssuedDb(order_id);

        return res.status(200).json({
            success: true,
            message: 'Tickets issued successfully',
            order_id: Number(order_id),
            ticket_count: tickets.length,
            tickets
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
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
                success: false,
                message: 'Order not found'
            });
        }

        const tickets = buildTicketsFromOrderRows(order_rows);

        return res.status(200).json({
            success: true,
            order_id: Number(order_id),
            ticket_count: tickets.length,
            tickets
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching tickets',
            error: error.message
        });
    }
};

export { postIssueTicketsCon, getOrderTicketsCon };
