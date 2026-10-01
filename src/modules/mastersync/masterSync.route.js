import { Router } from "express";
import {
  getMargUsers,
  syncMasterOrderData,
  syncMasterOrderDispatchData,
  syncMastersData,
} from "./masterSync.controller.js";

const masterSyncRouter = Router();

masterSyncRouter.get("/users", getMargUsers);
masterSyncRouter.get("/", syncMastersData);
masterSyncRouter.post("/", syncMastersData);

masterSyncRouter.get(
  "/order-dispatch/:salesManId",
  syncMasterOrderDispatchData,
);
masterSyncRouter.post(
  "/order-dispatch/:salesManId",
  syncMasterOrderDispatchData,
);

masterSyncRouter.get("/order/:salesManId", syncMasterOrderData);
masterSyncRouter.post("/order/:salesManId", syncMasterOrderData);

export default masterSyncRouter;
