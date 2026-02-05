import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import {
  assignStaffService,
  fetchMargUsersService,
  fetchStaffByIdService,
  fetchStaffService,
  updateStaffService,
} from "./staff.service.js";

export const fetchMargUsers = asyncHandler(async (req, res) => {
  const staffs = await fetchMargUsersService();

  return res
    .status(200)
    .json(new ApiResponse(200, staffs, "Staffs fetched successfully"));
});

export const assignStaff = asyncHandler(async (req, res) => {
  const { userId, name, email, password, ...payload } = req.body;

  if (!userId || !name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const staff = await assignStaffService({
    userId,
    name,
    email,
    password,
    ...payload,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, staff, "Staff assigned successfully"));
});

export const getAllStaff = asyncHandler(async (req, res) => {
  const { staff, totalStaff, totalActiveStaff, totalInactiveStaff } =
    await fetchStaffService();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { staff, totalStaff, totalActiveStaff, totalInactiveStaff },
        "Staff fetched successfully",
      ),
    );
});

export const updateStaff = asyncHandler(async (req, res) => {
  const { ...payload } = req.body;
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const staff = await updateStaffService(userId, payload);

  return res
    .status(200)
    .json(new ApiResponse(200, staff, "Staff updated successfully"));
});

export const fetchStaffById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const staff = await fetchStaffByIdService(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, staff, "Staff fetched successfully"));
});