import { Router } from "express";
import {
  fetchParties,
  getPartyDetails
} from "./party.controller.js";

const partyRouter = Router();

partyRouter.get("/", fetchParties);
partyRouter.get("/:rid", getPartyDetails);

export default partyRouter;
