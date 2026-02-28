import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  createOrderService,
  fetchOrdersBySalesmanService,
  fetchOrdersService,
} from "./order.service.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { salesManId } = req.params;
  const { OrderID, OrderNo, CustomerDetails, ProductDetails, PaymentDetails } =
    req.body;

  if (
    !OrderID ||
    !OrderNo ||
    !CustomerDetails ||
    !ProductDetails ||
    !PaymentDetails
  ) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid request"));
  }

  const data = await createOrderService(String(salesManId), {
    OrderID,
    OrderNo,
    CustomerDetails,
    ProductDetails,
    PaymentDetails,
  });

  res
    .status(200)
    .json(new ApiResponse(200, data, "Order created successfully"));
});

export const fetchOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, query = "" } = req.query;

  const { orders, totalOrders, totalPages, currentPage, hasMore } =
    await fetchOrdersService(page, limit, query);

  res.status(200).json(
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

export const fetchOrderBySalesman = asyncHandler(async (req, res) => {
  const { salesManId } = req.params;
  const {
    page = 1,
    limit = 25,
    all = false,
    query = "",
    month = "",
    year = "",
  } = req.query;

  if (!salesManId) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid request"));
  }

  const { orders, totalOrders, totalPages, currentPage, hasMore } =
    await fetchOrdersBySalesmanService(
      String(salesManId),
      page,
      limit,
      all,
      query,
      month,
      year,
    );

  res.status(200).json(
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
