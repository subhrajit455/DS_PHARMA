import Staff from "./staff.model.js";
import ApiError from "../../utils/apiError.js";
import bcrypt from "bcryptjs";
import MargUser from "./margUser.model.js";
import { syncMasterOrderDispatchDataService } from "../mastersync/masterSync.service.js";
import margOrder from "../order/order.model.js";

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

    const staffReport = await syncMasterOrderDispatchDataService(userId);

    staff.staffReport = staffReport;

    await staff.save();

    if (!staff) {
      throw new ApiError(404, "Staff details not found");
    }

    return { staff, staffReport };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || "Internal server error");
  }
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const fetchSalesmanMonthlyReportService = async (salesManId, year) => {
  try {
    const allYears = year === "all";
    const parsedYear = allYears
      ? null
      : parseInt(year, 10) || new Date().getFullYear();

    const matchStage = {
      $match: {
        Sid: String(salesManId),
        ...(parsedYear && {
          createdAt: {
            $gte: new Date(parsedYear, 0, 1),
            $lt: new Date(parsedYear + 1, 0, 1),
          },
        }),
      },
    };

    const pipeline = [
      matchStage,
      // Unwind products to sum quantities
      {
        $unwind: { path: "$ProductDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            orderId: "$_id",
            customerId: "$CustomerDetails.CustomerID",
          },
          totalQty: {
            $sum: {
              $add: [
                { $ifNull: [{ $toDouble: "$ProductDetails.Quantity" }, 0] },
                { $ifNull: [{ $toDouble: "$ProductDetails.Free" }, 0] },
              ],
            },
          },
          orderValue: {
            $first: {
              $ifNull: [{ $toDouble: "$PaymentDetails.paymentmodeAmount" }, 0],
            },
          },
        },
      },
      // Group by year+month (one doc per order now)
      {
        $group: {
          _id: { year: "$_id.year", month: "$_id.month" },
          totalOrders: { $sum: 1 },
          totalItemsSold: { $sum: "$totalQty" },
          uniqueCustomers: { $addToSet: "$_id.customerId" },
          totalOrderValue: { $sum: "$orderValue" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalOrders: 1,
          totalItemsSold: 1,
          uniqueCustomers: { $size: "$uniqueCustomers" },
          totalOrderValue: { $round: ["$totalOrderValue", 2] },
        },
      },
      { $sort: { year: 1, month: 1 } },
    ];

    const rawReport = await margOrder.aggregate(pipeline);

    // Build full 12-month map for the requested year so graph has zero values for empty months
    let monthlyReport;
    if (!allYears && parsedYear) {
      const monthMap = Object.fromEntries(rawReport.map((r) => [r.month, r]));
      monthlyReport = MONTH_NAMES.map((name, idx) => {
        const monthNum = idx + 1;
        return {
          month: monthNum,
          monthName: name,
          year: parsedYear,
          totalOrders: monthMap[monthNum]?.totalOrders || 0,
          totalItemsSold: monthMap[monthNum]?.totalItemsSold || 0,
          uniqueCustomers: monthMap[monthNum]?.uniqueCustomers || 0,
          totalOrderValue: monthMap[monthNum]?.totalOrderValue || 0,
        };
      });
    } else {
      monthlyReport = rawReport.map((r) => ({
        ...r,
        monthName: MONTH_NAMES[r.month - 1],
      }));
    }

    // Yearly summary totals
    const summary = {
      year: parsedYear || "all",
      totalOrders: monthlyReport.reduce((s, m) => s + m.totalOrders, 0),
      totalItemsSold: monthlyReport.reduce((s, m) => s + m.totalItemsSold, 0),
      totalOrderValue: parseFloat(
        monthlyReport.reduce((s, m) => s + m.totalOrderValue, 0).toFixed(2),
      ),
      bestMonth: monthlyReport.reduce(
        (best, m) => (m.totalOrders > (best?.totalOrders || 0) ? m : best),
        null,
      ),
    };

    return { monthlyReport, summary };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message || "Internal server error");
  }
};
