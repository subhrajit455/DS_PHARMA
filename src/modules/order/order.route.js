import { Router } from "express";
import { createOrder, fetchOrders } from "./order.controller.js";

const orderRouter = Router();

orderRouter.post("/:salesManId", createOrder);
orderRouter.get("/:salesManId", fetchOrders);

export default orderRouter;
