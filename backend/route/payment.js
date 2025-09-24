import express from 'express';
import { createOrder, verifyPayment } from '../controller/controllerPayment.js';
import authMiddleware from '../middleware/Auth.js';


const paymentrouter = express.Router();
paymentrouter.post('/create-order', authMiddleware, createOrder);
paymentrouter.post('/verify', authMiddleware, verifyPayment);
export default paymentrouter;