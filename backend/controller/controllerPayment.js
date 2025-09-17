import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../model/userModel.js';


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


const PRODUCTS = {
    basic: { amount: 1 * 100, credits: 10, name: 'Basic 10 credits' },
    premium: { amount: 999 * 100, credits: 100, name: 'Premium 100 credits' },
    pro: { amount: 1999 * 100, credits: 500, name: 'Pro 500 credits' }
};

export const createOrder = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = PRODUCTS[productId];
        if (!product) return res.status(400).json({ success: false, message: 'Invalid productId' });

        const order = await razorpay.orders.create({
            amount: product.amount,
            currency: 'INR',
            receipt: ` rcpt_${Date.now()}`,
            notes: { userId: req.body.userId, productId }
        });

        return res.status(201).json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, productId } = req.body;
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Signature verification failed' });
        }

        const product = PRODUCTS[productId];
        if (!product) return res.status(400).json({ success: false, message: 'Invalid productId' });

        const user = await User.findById(req.body.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const newBalance = (user.creditBalance || 0) + product.credits;
        await User.findByIdAndUpdate(user._id, { creditBalance: newBalance });

        // Log payment history


        return res.status(200).json({ success: true, message: 'Payment verified', creditBalance: newBalance });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};