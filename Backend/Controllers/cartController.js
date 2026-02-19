import { getCartDb, postCartDb, deleteCartDb, patchCartQuantityDb, deleteUserCartDb } from '../Models/cartModel.js';

// GET /cart/:user_id - Get all cart items for a user
const getCartCon = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const cart = await getCartDb(user_id);

        res.status(200).json({
            success: true,
            cart: cart
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
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
                success: false,
                message: 'user_id, event_id and quantity are required'
            });
        }

        const result = await postCartDb(user_id, event_id, quantity);

        res.status(201).json({
            success: true,
            message: 'Cart updated successfully',
            action: result.action,
            cart_id: result.cart_id
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
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
                success: false,
                message: 'quantity is required'
            });
        }

        const result = await patchCartQuantityDb(cart_id, quantity);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cart quantity updated successfully'
        });
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({
            success: false,
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
                success: false,
                message: 'Cart item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Removed from cart successfully'
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
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
            success: true,
            message: 'User cart cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing user cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing user cart'
        });
    }
};

export { getCartCon, postCartCon, patchCartQuantityCon, deleteCartCon, deleteUserCartCon };
