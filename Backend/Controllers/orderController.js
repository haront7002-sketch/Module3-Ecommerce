import { postOrderDb, postOrderItemsDb, getOrderDb, getUserOrdersDb, patchOrderStatusDb, postCheckoutOrderDb } from '../Models/orderModel.js';

// SECTION: Checkout/place order
const postCheckoutCon = async (req, res) => {
    try {
        const { user_id, payment_method, status = 'pending' } = req.body;

        if (!user_id || !payment_method) {
            return res.status(400).json({
                message: 'user_id and payment_method are required'
            });
        }

        const result = await postCheckoutOrderDb(user_id, payment_method, status);

        return res.status(201).json({
            message: 'Checkout completed successfully',
            ...result
        });
    } catch (error) {
        const status_code = error.message === 'Cart is empty' ? 400 : 500;
        return res.status(status_code).json({
            message: error.message === 'Cart is empty' ? 'Cart is empty' : 'Checkout failed',
            error: error.message
        });
    }
};

// SECTION: Create order (without items)
const postOrderCon = async (req, res) => {
    try {
        const { user_id, total, payment_method, status = 'pending' } = req.body;

        if (!user_id || total === undefined || !payment_method) {
            return res.status(400).json({
                message: 'user_id, total, and payment_method are required'
            });
        }

        const order_id = await postOrderDb(user_id, total, payment_method, status);

        return res.status(201).json({
            message: 'Order created',
            order_id
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};

// SECTION: Create order items
const postOrderItemsCon = async (req, res) => {
    try {
        const { order_id, items } = req.body;

        if (!order_id || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'order_id and items array are required'
            });
        }

        for (const item of items) {
            if (!item.event_id || item.quantity === undefined || item.price === undefined) {
                return res.status(400).json({
                    message: 'Each item must include event_id, quantity, and price'
                });
            }
        }

        const result = await postOrderItemsDb(order_id, items);

        return res.status(201).json({
            message: 'Order items created',
            affected_rows: result.affectedRows
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating order items',
            error: error.message
        });
    }
};

// SECTION: Read one order
const getOrderCon = async (req, res) => {
    try {
        const { order_id } = req.params;
        const order = await getOrderByIdDb(order_id);

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            order
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// SECTION: Read all orders for user
const getUserOrdersCon = async (req, res) => {
    try {
        const { user_id } = req.params;
        const orders = await getUserOrdersDb(user_id);

        return res.status(200).json({
            orders
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching user orders',
            error: error.message
        });
    }
};

// SECTION: Update order status
const patchOrderStatusCon = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: 'status is required'
            });
        }

        const result = await patchOrderStatusDb(order_id, status);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            message: 'Order status updated'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
};

export { postCheckoutCon, postOrderCon, postOrderItemsCon, getOrderCon, getUserOrdersCon, patchOrderStatusCon };
