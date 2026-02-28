import { generateToken } from "../../helpers/token.js";
import ApiError from "../../utils/apiError.js";
import Staff from "../staff/staff.model.js";
import UserModel from "./auth.model.js";
import bcrypt from "bcryptjs";

export const registerService = async (payload) => {
  const { employeeId, name, email, password } = payload;

  if (!employeeId || !name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await UserModel.findOne({
    $or: [{ employeeId }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    employeeId,
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

export const loginService = async (payload) => {
  const { userId, password } = payload;

  const user = await Staff.findOne({ userId });

  if (!user) {
    throw new ApiError(400, "Staff not assigned yet");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(400, "Incorrect password");
  }

  const userDetails = await Staff.findOne({ userId }).select("-password");

  const token = generateToken({
    id: userDetails._id,
    userId: userDetails.userId,
    role: userDetails.role,
  });

  return {
    user: userDetails,
    token,
  };
};

export const getUserProfile = async (userId) => {
  const user = await Staff.findOne({ userId }).select("-password");

  console.log("user", user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const token = generateToken({
    id: user._id,
    userId: user.userId,
    role: user.role,
  });

  console.log("token :: ", token);

  return {
    user,
    token,
  };
};
