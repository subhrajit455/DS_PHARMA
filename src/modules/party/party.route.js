import { Router } from "express";
import { partyAuthMiddleware } from "../../middlewares/auth.middleware.js";
import {
  fetchParties,
  getPartyByUserId,
  getPartyDetails,
  partyLoginController,
  partyRegisterController,
  updatePartyController
} from "./party.controller.js";

const partyRouter = Router();

partyRouter.get("/", fetchParties);
partyRouter.get("/:rid", getPartyDetails);

export default partyRouter;

export const partyAuthRouter = Router();

partyAuthRouter.post("/register", partyRegisterController);
partyAuthRouter.post("/login", partyLoginController);
partyAuthRouter.post("/logout", partyAuthMiddleware, partyLoginController);
partyAuthRouter.patch("/me", partyAuthMiddleware, updatePartyController);
partyAuthRouter.get("/user", partyAuthMiddleware, getPartyByUserId);
