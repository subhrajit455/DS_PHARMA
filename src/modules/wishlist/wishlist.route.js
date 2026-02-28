import { Router } from "express";
import {
  addToWishlist,
  getWishlist,
  getAdminWishlist,
  removeFromWishlist,
} from "./wishlist.controller.js";
import {
  partyAuthMiddleware,
  authMiddleware,
} from "../../middlewares/auth.middleware.js";

const wishlistRouter = Router();

wishlistRouter.post("/addwishlist", partyAuthMiddleware, addToWishlist);
wishlistRouter.get("/getwishlist", partyAuthMiddleware, getWishlist);
wishlistRouter.delete(
  "/deletewishlist/:id",
  partyAuthMiddleware,
  removeFromWishlist,
);

// Admin route — uses staff auth
wishlistRouter.get("/admin/wishlist", authMiddleware, getAdminWishlist);

export default wishlistRouter;
