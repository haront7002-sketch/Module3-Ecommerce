import { getCartDb, postCartDb, deleteCartDb, patchCartQuantityDb, deleteUserCartDb } from '../Models/cartModel.js';

// GET /cart/:user_id or /cart?user_id= - Get all cart items for a user
const getCartCon = async (req, res) => {
    try {
        const user_id = req.params.user_id || req.query.user_id;

        if (!user_id) {
            return res.status(400).json({
                message: 'user_id is required'
            });
        }

        const cart = await getCartDb(user_id);

        res.status(200).json({
            cart: cart
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            message: 'Error fetching cart'
        });
    }
};

// POST /cart - Add item to cart
const postCartCon = async (req, res) => {
    try {
        const { user_id, event_id, quantity } = req.body;

        if (!user_id || !event_id || !quantity) {
            return res.status(400).json({
                message: 'user_id, event_id and quantity are required'
            });
        }

        const parsed_user_id = Number(user_id);
        const parsed_event_id = Number(event_id);
        const parsed_quantity = Number(quantity);

        if (!Number.isInteger(parsed_user_id) || parsed_user_id <= 0) {
            return res.status(400).json({
                message: 'user_id must be a positive integer'
            });
        }

        if (!Number.isInteger(parsed_event_id) || parsed_event_id <= 0) {
            return res.status(400).json({
                message: 'event_id must be a positive integer'
            });
        }

        if (!Number.isFinite(parsed_quantity) || parsed_quantity <= 0) {
            return res.status(400).json({
                message: 'quantity must be a positive number'
            });
        }

        const result = await postCartDb(parsed_user_id, parsed_event_id, parsed_quantity);

        res.status(201).json({
            message: 'Cart updated successfully',
            action: result.action,
            cart_id: result.cart_id
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            message: 'Error adding to cart'
        });
    }
};

// PATCH /cart/:cart_id - Update quantity on one cart item
const patchCartQuantityCon = async (req, res) => {
    try {
        const cart_id = req.params.cart_id;
        const { quantity } = req.body;

        if (!quantity) {
            return res.status(400).json({
                message: 'quantity is required'
            });
        }

        const parsed_quantity = Number(quantity);
        if (!Number.isFinite(parsed_quantity) || parsed_quantity <= 0) {
            return res.status(400).json({
                message: 'quantity must be a positive number'
            });
        }

        const result = await patchCartQuantityDb(cart_id, parsed_quantity);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Cart item not found'
            });
        }

        res.status(200).json({
            message: 'Cart quantity updated successfully'
        });
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({
            message: 'Error updating cart quantity'
        });
    }
};

// DELETE /cart/:cart_id - Remove one item from cart
const deleteCartCon = async (req, res) => {
    try {
        const cart_id = req.params.cart_id;
        const result = await deleteCartDb(cart_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Cart item not found'
            });
        }

        res.status(200).json({
            message: 'Removed from cart successfully'
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            message: 'Error removing from cart'
        });
    }
};

// DELETE /cart/user/:user_id - Clear user cart
const deleteUserCartCon = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        await deleteUserCartDb(user_id);

        res.status(200).json({
            message: 'User cart cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing user cart:', error);
        res.status(500).json({
            message: 'Error clearing user cart'
        });
    }
};

export { getCartCon, postCartCon, patchCartQuantityCon, deleteCartCon, deleteUserCartCon };
