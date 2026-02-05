import ApiError from "../../utils/apiError.js";
import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { getUserProfile, loginService, registerService } from "./auth.service.js";

export const registerController = asyncHandler(async (req, res) => {
  const user = await registerService(req.body);

  return res.json(
    new ApiResponse(
      201,
      {
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "User registered successfully",
    ),
  );
});

export const loginController = asyncHandler(async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const { user, token } = await loginService({ userId, password });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json(new ApiResponse(200, user, "User logged in successfully"));
});

export const logoutController = asyncHandler(async (req, res) => {
  res.clearCookie("token");

  return res.json(new ApiResponse(200, {}, "Logged out successfully"));
});

export const getProfileController = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user.id);

  return res.json(
    new ApiResponse(
      200,
      user,
      "Profile fetched successfully",
    ),
  );
});
