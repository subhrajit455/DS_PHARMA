import { verifyToken } from "../helpers/token.js";
import ApiError from "../utils/apiError.js";
import UserModel from "../modules/auth/auth.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new ApiError(401, "Unauthorized Access"));
    }

    const decodedToken = verifyToken(token);

    const user = await UserModel.findById(decodedToken.id);

    if (!user) {
      return next(new ApiError(401, "Unauthorized - User not found"));
    }

    req.user = {
      id: user._id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    // Pass any errors to the error handler
    next(error instanceof ApiError ? error : new ApiError(401, "Unauthorized"));
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new ApiError(403, "Forbidden - Insufficient permissions"));
    }
    next();
  };
};
