import asyncHandler from "../../middlewares/asyncHandler.js";
import { fetchDashboardDataService } from "./dashboard.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const fetchDashboardData = asyncHandler(async (req, res) => {
  const dashboardData = await fetchDashboardDataService();
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dashboardData,
        "Dashboard data fetched successfully",
      ),
    );
});
