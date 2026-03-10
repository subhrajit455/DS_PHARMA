import { generateOTP } from '../../helpers/generateOTP.js';
import ApiError from '../../utils/apiError.js';
import { syncMasterOrderDataService } from '../mastersync/masterSync.service.js';
import Orders from './order.model.js';

export const createOrderService = async (
  salesManId,
  { OrderID, OrderNo, CustomerDetails, ProductDetails, PaymentDetails },
  type = 'S',
) => {
  try {
    await syncMasterOrderDataService(String(salesManId), type, {
      OrderID: String(OrderID),
      OrderNo: String(OrderNo),
      CustomerID: String(CustomerDetails?.CustomerID),
      ProductCode: String(ProductDetails?.map(item => item.code).join(',')),
      Quantity: String(ProductDetails?.map(item => item.Quantity).join(',')),
      Free: String(ProductDetails?.map(item => item.Free).join(',')),
      Lat: String(CustomerDetails?.Lat) || '',
      Lng: String(CustomerDetails?.Lng) || '',
      Address: String(CustomerDetails?.Address) || '',
      GpsID: '0',
      UserType: '1',
      Points: parseFloat(CustomerDetails?.Points || 0).toFixed(2),
      Discounts: String(CustomerDetails?.Discounts) || '0',
      Transport: String(CustomerDetails?.Transport) || '',
      Delivery: String(CustomerDetails?.Delivery) || '',
      Bankname: String(CustomerDetails?.BankName) || '',
      BankAdd1: String(CustomerDetails?.BankAdd1) || '',
      BankAdd2: String(CustomerDetails?.BankAdd2) || '',
      shipname: String(CustomerDetails?.ShipName) || '',
      shipAdd1: String(CustomerDetails?.ShipAdd1) || '',
      shipAdd2: String(CustomerDetails?.ShipAdd2) || '',
      shipAdd3: String(CustomerDetails?.ShipAdd3) || '',
      paymentmode: String(PaymentDetails?.paymentmode) || '',
      paymentmodeAmount: String(PaymentDetails?.paymentmodeAmount) || '0',
      payment_remarks: String(PaymentDetails?.payment_remarks) || '',
      order_remarks: String(CustomerDetails?.OrderRemarks) || '',
      CustName: String(CustomerDetails?.ShipName) || '',
      CustMobile: String(CustomerDetails?.CustMobile) || '',
    });

    const otp = generateOTP();

    const newOrder = await Orders.create({
      OrderID: OrderID,
      OrderNo: OrderNo,
      Sid: salesManId,
      CustomerDetails,
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
        { CustName: { $regex: query, $options: 'i' } },
        { OrderID: { $regex: query, $options: 'i' } },
      ];
    }

    const baseQuery = Orders.find(filter)
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
    const filter = { Sid: String(salesManId) };

    if (query) {
      filter.$or = [
        { CustName: { $regex: query, $options: 'i' } },
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
    const order = await Orders.findOneAndUpdate(
      { OrderID },
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
  try {
    const orders = await Orders.find({
      'CustomerDetails.CustomerID': CustomerId,
    });

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
