import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { createOrderService, fetchOrdersService } from "./order.service.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { salesManId } = req.params;
  const payload = req.body;

  if (!payload) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid request"));
  }

  const data = await createOrderService(String(salesManId), payload, "S");

  res
    .status(200)
    .json(new ApiResponse(200, data, "Order created successfully"));
});

export const fetchOrders = asyncHandler(async (req, res) => {
  const { salesManId } = req.params;

  const { page = 1, limit = 25, query = "" } = req.query;

  if (!salesManId) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid request"));
  }

  const { orders, totalOrders, totalPages, currentPage, hasMore } =
    await fetchOrdersService(String(salesManId), page, limit, query);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          orders,
          totalOrders,
          totalPages,
          page: Number(page),
          limit: Number(limit),
          totalPages: Number(totalPages),
          currentPage: Number(page),
          hasMore: Number(page) < Number(totalPages),
        },
        "Orders fetched successfully",
      ),
    );
});
