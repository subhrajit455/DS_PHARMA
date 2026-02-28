import ApiError from "../../utils/apiError.js";
import { syncMasterOrderDataService } from "../mastersync/masterSync.service.js";
import margOrder from "./order.model.js";

export const createOrderService = async (
  salesManId,
  { OrderID, OrderNo, CustomerDetails, ProductDetails, PaymentDetails },
  type = "S",
) => {
  try {
    // console.log({
    //   OrderID,
    //   OrderNo,
    //   CustomerDetails,
    //   ProductDetails,
    //   PaymentDetails
    // })

    // return

    await syncMasterOrderDataService(String(salesManId), type, {
      OrderID: OrderID,
      OrderNo: OrderNo,
      CustomerID: String(CustomerDetails.CustomerID),
      ProductCode: ProductDetails.map((item) => item.code).join(","),
      Quantity: ProductDetails.map((item) => item.Quantity).join(","),
      Free: ProductDetails.map((item) => item.Free).join(","),
      Lat: CustomerDetails.Lat,
      Lng: CustomerDetails.Lng,
      Address: CustomerDetails.Address || "",
      GpsID: "0",
      UserType: "1",
      Points: parseFloat(CustomerDetails.Points || 0).toFixed(2),
      Discounts: CustomerDetails.Discounts || "0",
      Transport: CustomerDetails.Transport || "",
      Delivery: CustomerDetails.Delivery || "",
      Bankname: CustomerDetails.BankName || "",
      BankAdd1: CustomerDetails.BankAdd1 || "",
      BankAdd2: CustomerDetails.BankAdd2 || "",
      shipname: CustomerDetails.ShipName || "",
      shipAdd1: CustomerDetails.ShipAdd1 || "",
      shipAdd2: CustomerDetails.ShipAdd2 || "",
      shipAdd3: CustomerDetails.ShipAdd3 || "",
      paymentmode: PaymentDetails.paymentmode || "",
      paymentmodeAmount: PaymentDetails.paymentmodeAmount || "0",
      payment_remarks: PaymentDetails.payment_remarks || "",
      order_remarks: CustomerDetails.OrderRemarks || "",
      CustName: CustomerDetails.ShipName || "",
      CustMobile: CustomerDetails.CustMobile || "",
    });

    const newOrder = await margOrder.create({
      OrderID: OrderID,
      OrderNo: OrderNo,
      Sid: salesManId,
      CustomerDetails,
      PaymentDetails,
      ProductDetails,
    });

    return newOrder;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const fetchOrdersService = async (page, limit, query) => {
  try {
    const orders = await margOrder
      .find({
        // Sid: String(salesManId),
        ...(query && {
          $or: [
            { CustName: { $regex: query, $options: "i" } },
            { OrderID: { $regex: query, $options: "i" } },
          ],
        }),
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalOrders = await margOrder.countDocuments({
      // Sid: String(salesManId),
      ...(query && {
        $or: [
          { CustName: { $regex: query, $options: "i" } },
          { OrderID: { $regex: query, $options: "i" } },
        ],
      }),
    });

    const totalPages = Math.ceil(totalOrders / limit);

    return {
      orders,
      totalOrders,
      totalPages,
      currentPage: Number(page),
      hasMore: Number(page) < Number(totalPages),
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
  try {
    const parsedMonth = month ? parseInt(month, 10) : null;
    const parsedYear = year ? parseInt(year, 10) : new Date().getFullYear();

    const filter = {
      Sid: String(salesManId),
    };

    if (query) {
      filter.$or = [
        { CustName: { $regex: query, $options: "i" } },
        { OrderID: { $regex: query, $options: "i" } },
      ];
    }

    if (parsedMonth && parsedYear) {
      filter.createdAt = {
        $gte: new Date(parsedYear, parsedMonth - 1, 1),
        $lt: new Date(parsedYear, parsedMonth, 1),
      };
    }

    let ordersQuery = margOrder.find(filter).sort({ createdAt: -1 });

    if (!all) {
      const skip = (page - 1) * limit;
      ordersQuery = ordersQuery.skip(skip).limit(limit);
    }

    const orders = await ordersQuery;

    const totalOrders = await margOrder.countDocuments(filter);

    const totalPages = all ? 1 : Math.ceil(totalOrders / limit);

    return {
      orders,
      totalOrders,
      totalPages,
      currentPage: Number(page),
      hasMore: !all && page < totalPages,
    };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
