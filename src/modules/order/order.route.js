import { Router } from "express";
import {
  createOrder,
  fetchOrderBySalesman,
  fetchOrders,
} from "./order.controller.js";

const orderRouter = Router();

orderRouter.post("/:salesManId", createOrder);
orderRouter.get("/", fetchOrders);
orderRouter.get("/:salesManId", fetchOrderBySalesman);

export default orderRouter;
