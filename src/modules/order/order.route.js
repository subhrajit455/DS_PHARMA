import { Router } from 'express';
import {
  createOrder,
  fetchOrderByParty,
  fetchOrderBySalesman,
  fetchOrders,
  resendOTP,
  updateOrderStatus,
} from './order.controller.js';
import {
  authMiddleware,
  partyAuthMiddleware,
} from '../../middlewares/auth.middleware.js';

const orderRouter = Router();

// orderRouter.use(authMiddleware);

orderRouter.post('/:salesManId', partyAuthMiddleware, createOrder);
orderRouter.get('/', fetchOrders);
orderRouter.get('/:salesManId', fetchOrderBySalesman);
orderRouter.patch('/:OrderID', updateOrderStatus);
orderRouter.patch('/resend/:OrderID', resendOTP);

export default orderRouter;

export const userOrder = Router();

userOrder.get('/userOrder', partyAuthMiddleware, fetchOrderByParty);
