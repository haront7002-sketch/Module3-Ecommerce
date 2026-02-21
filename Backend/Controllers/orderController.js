import orderModel from '../Models/orderModel.js';

// SECTION: Checkout/place order
const postCheckoutCon = async (req, res) => {
    try {
        const { user_id, payment_method, status = 'pending' } = req.body;

        if (!user_id || !payment_method) {
            return res.status(400).json({
                success: false,
                message: 'user_id and payment_method are required'
            });
        }

        const result = await orderModel.postCheckoutOrderDb(user_id, payment_method, status);

        return res.status(201).json({
            success: true,
            message: 'Checkout completed successfully',
            ...result
        });
    } catch (error) {
        const status_code = error.message === 'Cart is empty' ? 400 : 500;
        return res.status(status_code).json({
            success: false,
            message: error.message === 'Cart is empty' ? 'Cart is empty' : 'Checkout failed',
            error: error.message
        });
    }
};

// SECTION: Read one order
const getOrderByIdCon = async (req, res) => {
    try {
        const { order_id } = req.params;
        const order = await orderModel.getOrderByIdDb(order_id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// SECTION: Read all orders for user
const getUserOrdersCon = async (req, res) => {
    try {
        const { user_id } = req.params;
        const orders = await orderModel.getUserOrdersDb(user_id);

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
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
                success: false,
                message: 'status is required'
            });
        }

        const result = await orderModel.patchOrderStatusDb(order_id, status);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order status updated'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};

export { postCheckoutCon, getOrderByIdCon, getUserOrdersCon, patchOrderStatusCon };
