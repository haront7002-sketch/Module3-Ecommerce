import { postCheckoutDb } from '../Models/checkoutModel.js';

const postCheckoutCon = async (req, res) => {
    try {
        const { user_id, payment_method, status = 'pending' } = req.body;

        if (!user_id || !payment_method) {
            return res.status(400).json({
                message: 'user_id and payment_method are required'
            });
        }

        const result = await postCheckoutDb(user_id, payment_method, status);

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

export { postCheckoutCon };
