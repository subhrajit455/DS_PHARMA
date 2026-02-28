import { Router } from "express";
import {
  assignStaff,
  fetchMargUsers,
  fetchSalesmanMonthlyReport,
  fetchStaffById,
  getAllStaff,
  updateStaff,
} from "./staff.controller.js";

const staffRouter = Router();

staffRouter.get("/marg-users", fetchMargUsers);
staffRouter.get("/", getAllStaff);
staffRouter.get("/:userId/monthly-report", fetchSalesmanMonthlyReport);
staffRouter.get("/:userId", fetchStaffById);
staffRouter.patch("/:userId", updateStaff);
staffRouter.post("/assign-staff", assignStaff);

export default staffRouter;
