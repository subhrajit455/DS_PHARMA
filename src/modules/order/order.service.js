import mongoose from 'mongoose';
import { ecomSalesManId } from '../../config/credentials.js';
import { generateOTP } from '../../helpers/generateOTP.js';
import ApiError from '../../utils/apiError.js';
import { syncMasterOrderDataService } from '../mastersync/masterSync.service.js';
import MargParties from '../mastersync/marg_parties.model.js';
import Orders from './order.model.js';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const createOrderService = async (
  salesManId,
  { OrderID, OrderNo, CustomerDetails, ProductDetails, PaymentDetails },
  type = 'S',
) => {
  try {
    // Helper to sanitize text fields for Marg ERP
    const sanitizeStr = (val, defaultVal = '') => {
      if (val === undefined || val === null || val === 'undefined' || val === 'null') {
        return defaultVal;
      }
      return String(val).replace(/[\r\n]+/g, ' ').trim();
    };

    const rawCustomerId = sanitizeStr(CustomerDetails?.CustomerID);
    const rawMobile = sanitizeStr(CustomerDetails?.CustMobile || CustomerDetails?.phone);

    // 1. Resolve Marg party to get the real Marg Party Code / rid
    const searchConditions = [];
    if (rawCustomerId) {
      searchConditions.push(
        { rid: rawCustomerId },
        { code: rawCustomerId },
        { MargCode: rawCustomerId },
      );
      if (mongoose.isValidObjectId(rawCustomerId)) {
        searchConditions.push({ _id: rawCustomerId });
      }
    }
    if (rawMobile) {
      searchConditions.push(
        { phone1: rawMobile },
        { phone2: rawMobile },
        { userId: rawMobile },
      );
    }

    const party = searchConditions.length > 0
      ? await MargParties.findOne({ $or: searchConditions }).lean()
      : null;

    // Marg ERP expects the party's numeric rid as CustomerID, blank OrderID, and integer OrderNo (<= 8 digits)
    const margCustomerId = sanitizeStr(
      party?.rid || CustomerDetails?.CustomerID || party?.code
    );
    const margOrderNo = String(OrderNo).length > 8
      ? String(OrderNo).slice(-8)
      : String(OrderNo);
    const validCustName = sanitizeStr(
      party?.name ||
      CustomerDetails?.CustName ||
      CustomerDetails?.shipname ||
      CustomerDetails?.shipName
    );
    const validCustMobile = sanitizeStr(
      party?.phone1 ||
      party?.phone2 ||
      party?.userId ||
      CustomerDetails?.CustMobile ||
      CustomerDetails?.phone
    );
    const validAddress = sanitizeStr(
      party?.address ||
      CustomerDetails?.Address
    );
    const shipName = sanitizeStr(
      CustomerDetails?.shipname ||
      CustomerDetails?.shipName ||
      validCustName
    );
    const shipAdd1 = sanitizeStr(CustomerDetails?.shipAdd1 || validAddress);
    const shipAdd2 = sanitizeStr(CustomerDetails?.shipAdd2);
    const shipAdd3 = sanitizeStr(CustomerDetails?.shipAdd3);

    await syncMasterOrderDataService(String(ecomSalesManId), type, {
      OrderID: '',
      OrderNo: margOrderNo,
      CustomerID: margCustomerId,
      ProductCode: String(ProductDetails?.map(item => sanitizeStr(item.code || item.ProductCode || item.rid)).join(',')),
      Quantity: String(ProductDetails?.map(item => item.Quantity ?? item.quantity ?? 1).join(',')),
      Free: String(ProductDetails?.map(item => item.Free ?? item.free ?? 0).join(',')),
      Lat: '',
      Lng: '',
      Address: '',
      GpsID: '0',
      UserType: '1',
      Points: '0.00',
      Discounts: '0',
      Transport: '',
      Delivery: '',
      Bankname: '',
      BankAdd1: '',
      BankAdd2: '',
      shipname: '',
      shipAdd1: '',
      shipAdd2: '',
      shipAdd3: '',
      paymentmode: '1',
      paymentmodeAmount: '0',
      payment_remarks: '',
      order_remarks: sanitizeStr(CustomerDetails?.order_remarks),
      CustName: validCustName,
      CustMobile: validCustMobile,
    });

    const otp = generateOTP();

    const newOrder = await Orders.create({
      OrderID: OrderID,
      OrderNo: OrderNo,
      Sid: salesManId,
      CustomerDetails: {
        ...CustomerDetails,
        CustomerID: margCustomerId,
        partyCode: party?.code ? sanitizeStr(party.code) : '',
        rid: party?.rid || CustomerDetails?.CustomerID || '',
        CustName: validCustName,
        CustMobile: validCustMobile,
      },
      PaymentDetails,
      ProductDetails,
      OTP: otp,
    });

    return newOrder;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const fetchOrdersService = async (page, limit, query) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.max(parseInt(limit, 10) || 10, 1);

  try {
    const filter = {};

    if (query) {
      filter.$or = [
        { 'CustomerDetails.CustName': { $regex: query, $options: 'i' } },
        { OrderID: { $regex: query, $options: 'i' } },
      ];
    }

    const baseQuery = Orders.find(filter)
      .populate('Sid')
      .sort({ createdAt: -1 })
      .select('-OTP')
      .lean();

    const [orders, totalOrders] = await Promise.all([
      baseQuery.skip((parsedPage - 1) * parsedLimit).limit(parsedLimit),
      Orders.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalOrders / parsedLimit);

    return {
      orders,
      totalOrders,
      totalPages,
      currentPage: parsedPage,
      hasMore: parsedPage < totalPages,
    };
  } catch (error) {
    console.log('error : ', error);
    throw new ApiError(500, error.message);
  }
};

export const fetchOrdersBySalesmanService = async (
  salesManId,
  page = 1,
  limit = 10,
  all = false,
  query,
  month,
  year,
) => {
  if (!salesManId) {
    throw new ApiError(400, 'salesManId is required');
  }

  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.max(parseInt(limit, 10) || 10, 1);

  try {
    const filter = { Sid: salesManId };

    if (query) {
      filter.$or = [
        { 'CustomerDetails.CustName': { $regex: query, $options: 'i' } },
        { OrderID: { $regex: query, $options: 'i' } },
      ];
    }

    if (month && year) {
      const parsedMonth = parseInt(month, 10);
      const parsedYear = parseInt(year, 10);

      const startDate = new Date(parsedYear, parsedMonth - 1, 1);
      const endDate = new Date(parsedYear, parsedMonth, 1);

      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    const queryBuilder = Orders.find(filter)
      .populate('Sid')
      .sort({ createdAt: -1 })
      .select('-OTP')
      .lean();

    const [orders, totalOrders] = await Promise.all([
      all
        ? queryBuilder
        : queryBuilder.skip((parsedPage - 1) * parsedLimit).limit(parsedLimit),
      Orders.countDocuments(filter),
    ]);

    const totalPages = all ? 1 : Math.ceil(totalOrders / parsedLimit);

    return {
      orders,
      totalOrders,
      totalPages,
      currentPage: parsedPage,
      hasMore: !all && parsedPage < totalPages,
    };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const resendOTPService = async OrderID => {
  if (!OrderID) {
    throw new ApiError(400, 'OrderID is required');
  }

  try {
    const order = await Orders.findOneAndUpdate(
      { OrderID },
      { $set: { OTP: generateOTP() } },
      {
        new: true,
      },
    );

    if (!order) {
      throw new ApiError(404, 'Invalid OrderID');
    }

    return order;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const updateOrderService = async (OrderID, status) => {
  if (!OrderID) {
    throw new ApiError(400, 'OrderID is required');
  }

  if (!status) {
    throw new ApiError(400, 'Status is required');
  }

  try {
    const filter = mongoose.isValidObjectId(OrderID)
      ? { $or: [{ _id: OrderID }, { OrderID }] }
      : { OrderID };

    const order = await Orders.findOneAndUpdate(
      filter,
      { $set: { Status: status } },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    return order;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const fetchOrderByPartyService = async CustomerId => {
  console.log('fetchOrderByPartyService CustomerId:', CustomerId);

  try {
    const rawId = String(CustomerId || '').trim();
    const party = rawId
      ? await MargParties.findOne({
          $or: [
            { rid: rawId },
            { code: rawId },
            { MargCode: rawId },
            ...(mongoose.isValidObjectId(rawId) ? [{ _id: rawId }] : []),
          ],
        }).lean()
      : null;

    const possibleIds = [
      rawId,
      party?.rid,
      party?.code,
      party?.MargCode,
    ].filter(Boolean);

    const orders = await Orders.find({
      $or: [
        { 'CustomerDetails.CustomerID': { $in: possibleIds } },
        { 'CustomerDetails.rid': { $in: possibleIds } },
        { 'CustomerDetails.partyCode': { $in: possibleIds } },
      ],
    }).sort({ createdAt: -1 });

    return orders;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const updatePaymentStatusService = async (OrderID, status) => {
  if (!OrderID) {
    throw new ApiError(400, 'OrderID is required');
  }

  if (!status) {
    throw new ApiError(400, 'Status is required');
  }

  try {
    const order = await Orders.findOneAndUpdate(
      { OrderID },
      { $set: { 'PaymentDetails.paymentStatus': status } },
      {
        new: true,
        runValidators: true,
      },
    );

    return order;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const fetchMonthlyReportService = async options => {
  try {
    const {
      mode = 'yearly',
      year = new Date().getFullYear(),
      month,
      startDate,
      endDate,
    } = options;

    const parsedYear = parseInt(year, 10) || new Date().getFullYear();
    const parsedMonth = month ? parseInt(month, 10) : null;

    // ── Build date filter ──────────────────────────────────────────
    let dateFilter = null;

    if (mode === 'yearly') {
      dateFilter = {
        $gte: new Date(parsedYear, 0, 1),
        $lt: new Date(parsedYear + 1, 0, 1),
      };
    } else if (mode === 'monthly' && parsedMonth) {
      dateFilter = {
        $gte: new Date(parsedYear, parsedMonth - 1, 1),
        $lt: new Date(parsedYear, parsedMonth, 1),
      };
    } else if (mode === 'custom' && startDate && endDate) {
      dateFilter = {
        $gte: new Date(startDate),
        $lt: new Date(
          new Date(endDate).setDate(new Date(endDate).getDate() + 1),
        ), // inclusive end
      };
    }

    const matchStage = {
      $match: {
        ...(dateFilter && { createdAt: dateFilter }),
      },
    };

    // ── Group key differs per mode ─────────────────────────────────
    const groupId =
      mode === 'monthly'
        ? {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        }
        : { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } };

    const pipeline = [
      matchStage,
      {
        $unwind: { path: '$ProductDetails', preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: {
            ...groupId,
            orderId: '$_id',
            customerId: '$CustomerDetails.CustomerID',
          },
          totalQty: {
            $sum: {
              $add: [
                {
                  $convert: {
                    input: '$ProductDetails.Quantity',
                    to: 'double',
                    onError: 0,
                    onNull: 0,
                  },
                },
                {
                  $convert: {
                    input: '$ProductDetails.Free',
                    to: 'double',
                    onError: 0,
                    onNull: 0,
                  },
                },
              ],
            },
          },
          orderValue: {
            $first: {
              $convert: {
                input: '$PaymentDetails.paymentmodeAmount',
                to: 'double',
                onError: 0,
                onNull: 0,
              },
            },
          },
        },
      },
      {
        $group: {
          _id:
            mode === 'monthly'
              ? { year: '$_id.year', month: '$_id.month', day: '$_id.day' }
              : { year: '$_id.year', month: '$_id.month' },
          totalOrders: { $sum: 1 },
          totalItemsSold: { $sum: '$totalQty' },
          uniqueCustomers: { $addToSet: '$_id.customerId' },
          totalOrderValue: { $sum: '$orderValue' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          ...(mode === 'monthly' && { day: '$_id.day' }),
          totalOrders: 1,
          totalItemsSold: 1,
          uniqueCustomers: { $size: '$uniqueCustomers' },
          totalOrderValue: { $round: ['$totalOrderValue', 2] },
        },
      },
      { $sort: { year: 1, month: 1, ...(mode === 'monthly' && { day: 1 }) } },
    ];

    const rawReport = await Orders.aggregate(pipeline);

    // ── Fill zeros for yearly/monthly modes ────────────────────────
    let report;

    if (mode === 'yearly') {
      const monthMap = Object.fromEntries(rawReport.map(r => [r.month, r]));
      report = MONTH_NAMES.map((name, idx) => {
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
    } else if (mode === 'monthly' && parsedMonth) {
      const daysInMonth = new Date(parsedYear, parsedMonth, 0).getDate();
      const dayMap = Object.fromEntries(rawReport.map(r => [r.day, r]));
      report = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        return {
          day,
          month: parsedMonth,
          monthName: MONTH_NAMES[parsedMonth - 1],
          year: parsedYear,
          totalOrders: dayMap[day]?.totalOrders || 0,
          totalItemsSold: dayMap[day]?.totalItemsSold || 0,
          uniqueCustomers: dayMap[day]?.uniqueCustomers || 0,
          totalOrderValue: dayMap[day]?.totalOrderValue || 0,
        };
      });
    } else {
      // custom / all — return raw with monthName added
      report = rawReport.map(r => ({
        ...r,
        monthName: MONTH_NAMES[r.month - 1],
      }));
    }

    // ── Summary totals ─────────────────────────────────────────────
    const summary = {
      mode,
      year: parsedYear,
      ...(mode === 'monthly' && {
        month: parsedMonth,
        monthName: MONTH_NAMES[parsedMonth - 1],
      }),
      ...(mode === 'custom' && { startDate, endDate }),
      totalOrders: report.reduce((s, m) => s + m.totalOrders, 0),
      totalItemsSold: report.reduce((s, m) => s + m.totalItemsSold, 0),
      totalOrderValue: parseFloat(
        report.reduce((s, m) => s + m.totalOrderValue, 0).toFixed(2),
      ),
      bestPeriod: report.reduce(
        (best, m) => (m.totalOrders > (best?.totalOrders || 0) ? m : best),
        null,
      ),
    };

    return { report, summary };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, error.message || 'Internal server error');
  }
};
