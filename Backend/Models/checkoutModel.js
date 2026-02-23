import { db } from '../Config/database.js';

const postCheckoutDb = async (user_id, payment_method, status = 'pending') => {
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

        const [order_result] = await connection.query(
            'INSERT INTO orders (user_id, total, status, payment_method, created_at) VALUES (?, ?, ?, ?, NOW())',
            [user_id, total, status, payment_method]
        );

        const order_id = order_result.insertId;
        const order_item_values = cart_rows.map((item) => [
            order_id,
            item.event_id,
            item.quantity,
            item.price
        ]);

        await connection.query(
            'INSERT INTO order_items (order_id, event_id, quantity, price) VALUES ?',
            [order_item_values]
        );

        await connection.query(
            'DELETE FROM cart WHERE user_id = ?',
            [user_id]
        );

        await connection.commit();
        return {
            order_id,
            total,
            status,
            item_count: cart_rows.length
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export { postCheckoutDb };
