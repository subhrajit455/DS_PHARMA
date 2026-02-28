import { verifyToken } from "../helpers/token.js";
import ApiError from "../utils/apiError.js";
import Staff from "../modules/staff/staff.model.js";
import Party from "../modules/party/party.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    console.log("token", token);

    if (!token) {
      return next(new ApiError(401, "Unauthorized Access"));
    }

    const decodedToken = verifyToken(token);

    console.log("decodedToken", decodedToken);

    const user = await Staff.findById(decodedToken.id);

    if (!user) {
      return next(new ApiError(401, "Unauthorized - User not found"));
    }

    req.user = {
      id: user._id,
      userId: user.userId,
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

export const partyAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new ApiError(401, "Unauthorized Access"));
    }

    const decodedToken = verifyToken(token);

    if (decodedToken.role !== "party") {
      return next(new ApiError(403, "Forbidden - Not a party account"));
    }

    const party = await Party.findById(decodedToken.id).select("-password");

    if (!party) {
      return next(new ApiError(401, "Unauthorized - Party not found"));
    }

    req.user = {
      id: party?._id,
      userId: party?.userId,
      rid: party?.rid || null,
      role: party?.role || "party",
    };
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(401, "Unauthorized"));
  }
};
