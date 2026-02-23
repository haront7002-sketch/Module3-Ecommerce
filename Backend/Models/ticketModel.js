import { db } from '../Config/database.js';

// SECTION: Read order rows needed to build tickets
const getOrderTicketRowsDb = async (order_id, query_db = db) => {
    const [rows] = await query_db.query(
        `SELECT o.order_id, o.user_id, o.status, o.created_at,
                oi.items_id, oi.event_id, oi.quantity, oi.price,
                e.event_title, e.date, e.location
         FROM orders o
         JOIN order_items oi ON o.order_id = oi.order_id
         JOIN events e ON oi.event_id = e.event_id
         WHERE o.order_id = ?
         ORDER BY oi.items_id ASC`,
        [order_id]
    );

    return rows;
};

// SECTION: Build ticket payload from order rows
const buildTicketsFromOrderRows = (order_rows) => {
    const tickets = [];

    for (const row of order_rows) {
        for (let i = 1; i <= row.quantity; i += 1) {
            tickets.push({
                ticket_code: `${row.order_id}-${row.items_id}-${i}`,
                order_id: row.order_id,
                user_id: row.user_id,
                event_id: row.event_id,
                event_title: row.event_title,
                event_date: row.date,
                event_location: row.location,
                unit_price: row.price,
                seat_number: i
            });
        }
    }

    return tickets;
};

// SECTION: Mark order as tickets issued
const patchOrderTicketsIssuedDb = async (order_id, query_db = db) => {
    const [result] = await query_db.query(
        'UPDATE orders SET status = ? WHERE order_id = ?',
        ['tickets_issued', order_id]
    );

    return result;
};

export { getOrderTicketRowsDb, buildTicketsFromOrderRows, patchOrderTicketsIssuedDb };
