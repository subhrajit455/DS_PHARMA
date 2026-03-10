import { generateToken } from '../../helpers/token.js';
import ApiError from '../../utils/apiError.js';
import Staff from '../staff/staff.model.js';
import bcrypt from 'bcryptjs';

export const loginService = async payload => {
  const { userId, password } = payload;

  const user = await Staff.findOne({ phone: userId });

  if (!user) {
    throw new ApiError(400, 'Staff not found. Please contact admin.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is disabled. Please contact admin.');
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(400, 'Incorrect password');
  }

  const userDetails = await Staff.findOne({ phone: userId }).select('-password');

  const token = generateToken({
    id: userDetails._id,
    userId: userDetails.phone,
    role: userDetails.role,
  });

  return {
    user: userDetails,
    token,
  };
};

export const getUserProfile = async userId => {
  const user = await Staff.findOne({ userId }).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const token = generateToken({
    id: user._id,
    userId: user.userId,
    role: user.role,
  });

  return {
    user,
    token,
  };
};
