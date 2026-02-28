import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "./cart.controller.js";
import { partyAuthMiddleware } from "../../middlewares/auth.middleware.js";

const cartRouter = Router();

cartRouter.post("/cartadd", partyAuthMiddleware, addToCart);
cartRouter.get("/cartget", partyAuthMiddleware, getCart);
cartRouter.put("/cartupdate/:id", partyAuthMiddleware, updateCartItem);
cartRouter.delete("/cartdelete/:id", partyAuthMiddleware, removeCartItem);

export default cartRouter;
