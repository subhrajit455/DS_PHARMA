import Staff from "./staff.model.js";
import ApiError from "../../utils/apiError.js";
import bcrypt from "bcryptjs";
import MargUser from "./margUser.model.js";

export const fetchMargUsersService = async () => {
  try {
    const margUsers = await MargUser.find();
    return margUsers;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const assignStaffService = async ({
  userId,
  name,
  email,
  password,
  ...payload
}) => {
  try {
    const existingStaff = await Staff.findOne({ userId });

    if (existingStaff) {
      throw new ApiError(400, "Staff already assigned");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaffData = await Staff.create({
      userId,
      name,
      email,
      password: hashedPassword,
      ...payload,
    });

    const staff = await Staff.findById(newStaffData._id).select("-password");

    return staff;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || "Internal server error");
  }
};

export const fetchStaffService = async () => {
  try {
    const staff = await Staff.find().select("-password");

    const totalStaff = await Staff.countDocuments();

    const totalActiveStaff = await Staff.countDocuments({ isActive: true });

    const totalInactiveStaff = await Staff.countDocuments({ isActive: false });

    return { staff, totalStaff, totalActiveStaff, totalInactiveStaff };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || "Internal server error");
  }
};

export const updateStaffService = async (userId, payload) => {
  try {
    const staff = await Staff.findByIdAndUpdate(userId, payload, {
      new: true,
      runValidators: true,
    });
    return staff;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || "Internal server error");
  }
};

export const fetchStaffByIdService = async (userId) => {
  try {
    const staff = await Staff.findOne({ userId }).select("-password");

    if (!staff) {
      throw new ApiError(404, "Staff details not found");
    }

    return staff;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || "Internal server error");
  }
};
