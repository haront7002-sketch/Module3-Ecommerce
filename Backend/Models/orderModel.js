import { db } from "../Config/database.js"

// SECTION: Create order record
const postOrderDb = async (user_id, total, payment_method, status = 'pending', query_db = db) => {
    const [result] = await query_db.query(
        'INSERT INTO orders (user_id, total, status, payment_method, created_at) VALUES (?, ?, ?, ?, NOW())',
        [user_id, total, status, payment_method]
    );
    return result.insertId;
};

// SECTION: Create order items
const postOrderItemsDb = async (order_id, cart_items, query_db = db) => {
    const values = cart_items.map(item => [
        order_id,
        item.event_id,
        item.quantity,
        item.price
    ]);
    const [result] = await query_db.query(
        'INSERT INTO order_items (order_id, event_id, quantity, price) VALUES ?',
        [values]
    );
    return result;
};

// SECTION: Read single order with items
const getOrderDb = async (order_id, query_db = db) => {
    const [rows] = await query_db.query(`
        SELECT o.*,
               JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'event_id', oi.event_id,
                       'event_title', e.event_title,
                       'quantity', oi.quantity,
                       'price', oi.price
                   )
               ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN events e ON oi.event_id = e.event_id
        WHERE o.order_id = ?
        GROUP BY o.order_id
    `, [order_id]);
    return rows[0];
};

// SECTION: Read all orders for one user
const getUserOrdersDb = async (user_id, query_db = db) => {
    const [rows] = await query_db.query(`
        SELECT o.*,
               COUNT(oi.items_id) as item_count,
               SUM(oi.quantity) as total_items
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.user_id = ?
        GROUP BY o.order_id
        ORDER BY o.created_at DESC
    `, [user_id]);
    return rows;
};

// SECTION: Update order status
const patchOrderStatusDb = async (order_id, status, query_db = db) => {
    const [result] = await query_db.query(
        'UPDATE orders SET status = ? WHERE order_id = ?',
        [status, order_id]
    );
    return result;
};

// SECTION: Checkout/place order from cart (atomic transaction)
const postCheckoutOrderDb = async (user_id, payment_method, status = 'pending') => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [cart_rows] = await connection.query(
            `SELECT c.event_id, c.quantity, e.price
             FROM cart c
             JOIN events e ON c.event_id = e.event_id
             WHERE c.user_id = ?`,
            [user_id]
        );

        if (!cart_rows.length) {
            throw new Error('Cart is empty');
        }

        const total = cart_rows.reduce((sum, item) => {
            return sum + (Number(item.price) * Number(item.quantity));
        }, 0);

        const order_id = await postOrderDb(
            user_id,
            total,
            payment_method,
            status,
            connection
        );

        await postOrderItemsDb(order_id, cart_rows, connection);

        await connection.query(
            'DELETE FROM cart WHERE user_id = ?',
            [user_id]
        );

        await connection.commit();
        return { order_id, total, status, item_count: cart_rows.length };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export { postOrderDb, postOrderItemsDb, getOrderDb, getUserOrdersDb, patchOrderStatusDb, postCheckoutOrderDb };