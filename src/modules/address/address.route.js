import { Router } from "express";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setaddress,
  getAddressesbyuser,
} from "./address.controller.js";
import { partyAuthMiddleware } from "../../middlewares/auth.middleware.js";

const addressRouter = Router();

addressRouter.post("/address", partyAuthMiddleware, addAddress);
addressRouter.get("/address", partyAuthMiddleware, getAddresses);
addressRouter.put("/address/:id", partyAuthMiddleware, updateAddress);
addressRouter.delete("/address/:id", partyAuthMiddleware, deleteAddress);
addressRouter.put("/address/set/:id", partyAuthMiddleware, setaddress);
addressRouter.get("/addressbyuser", partyAuthMiddleware, getAddressesbyuser);

export default addressRouter;
