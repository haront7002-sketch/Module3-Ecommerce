import { db } from '../Config/database.js';

// Get user's cart items
const getCartDb = async (user_id) => {
    const [rows] = await db.query(`
        SELECT c.*, e.event_title, e.description, e.date, e.time, e.location, e.price, e.image_url 
        FROM cart c
        JOIN events e ON c.event_id = e.event_id
        WHERE c.user_id = ?
        ORDER BY c.added_at DESC
    `, [user_id]);
    return rows;
};

// Add item to cart or update quantity if exists
const postCartDb = async (user_id, event_id, quantity) => {
    // First check if item exists
    const [existing] = await db.query(
        'SELECT * FROM cart WHERE user_id = ? AND event_id = ?',
        [user_id, event_id]
    );
    
    if (existing.length > 0) {
        // Update quantity if exists
        const newQuantity = existing[0].quantity + quantity;
        const [result] = await db.query(
            'UPDATE cart SET quantity = ?, added_at = NOW() WHERE cart_id = ?',
            [newQuantity, existing[0].cart_id]
        );
        return { result, action: 'updated', cart_id: existing[0].cart_id };
    } else {
        // Insert new item
        const [result] = await db.query(
            'INSERT INTO cart (user_id, event_id, quantity, added_at) VALUES (?, ?, ?, NOW())',
            [user_id, event_id, quantity]
        );
        return { result, action: 'inserted', cart_id: result.insertId };
    }
};

// Remove item from cart
const deleteCartDb = async (cart_id) => {
    const [result] = await db.query(
        'DELETE FROM cart WHERE cart_id = ?',
        [cart_id]
    );
    return result;
};

// Update specific cart item quantity
const patchCartQuantityDb = async (cart_id, quantity) => {
    const [result] = await db.query(
        'UPDATE cart SET quantity = ?, added_at = NOW() WHERE cart_id = ?',
        [quantity, cart_id]
    );
    return result;
};

// Get single cart item
const getCartItemDb = async (cart_id) => {
    const [rows] = await db.query(
        'SELECT * FROM cart WHERE cart_id = ?',
        [cart_id]
    );
    return rows[0];
};

// Clear user's cart after checkout
const deleteUserCartDb = async (user_id) => {
    const [result] = await db.query(
        'DELETE FROM cart WHERE user_id = ?',
        [user_id]
    );
    return result;
};

export { getCartDb, postCartDb, deleteCartDb, patchCartQuantityDb, getCartItemDb, deleteUserCartDb};
