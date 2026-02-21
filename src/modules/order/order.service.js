import ApiError from "../../utils/apiError.js";
import { syncMasterOrderDataService } from "../mastersync/masterSync.service.js";
import ProN from "../products/proN.model.js";
import margOrder from "./order.model.js";

export const createOrderService = async (salesManId, payload, type) => {
  try {
    await syncMasterOrderDataService(String(salesManId), type, payload);

    const customerDetails = {
      CustomerID: payload.CustomerID,
      Lat: payload.Lat,
      Lng: payload.Lng,
      Address: payload.Address,
      GpsID: payload.GpsID,
      UserType: payload.UserType,
      Points: payload.Points,
      Discounts: payload.Discounts,
      Transport: payload.Transport,
      Delivery: payload.Delivery,
      Bankname: payload.Bankname,
      BankAdd1: payload.BankAdd1,
      BankAdd2: payload.BankAdd2,
      shipname: payload.shipname,
      shipAdd1: payload.shipAdd1,
      shipAdd2: payload.shipAdd2,
      shipAdd3: payload.shipAdd3,
      order_remarks: payload.order_remarks,
      CustName: payload.CustName,
      CustMobile: payload.CustMobile,
    };

    const paymentDetails = {
      paymentmode: payload.paymentmode,
      paymentmodeAmount: payload.paymentmodeAmount,
      payment_remarks: payload.payment_remarks,
    };

    const productCodes = payload.ProductCode.split(",");
    const quantities = payload.Quantity.split(",");
    const frees = payload.Free.split(",");

    const productDetails = await Promise.all(
      productCodes.map(async (productCode, index) => {
        const details = await ProN.findOne({ code: productCode });

        return {
          ...details.toObject(),
          Quantity: quantities[index],
          Free: frees[index],
        };
      }),
    );

    console.log({
      OrderID: payload.OrderID,
      OrderNo: payload.OrderNo,
      Sid: salesManId,
      CustomerDetails: customerDetails,
      PaymentDetails: paymentDetails,
      ProductDetails: productDetails,
    });

    const newOrder = await margOrder.create({
      OrderID: payload.OrderID,
      OrderNo: payload.OrderNo,
      Sid: salesManId,
      CustomerDetails: customerDetails,
      PaymentDetails: paymentDetails,
      ProductDetails: productDetails,
    });

    return newOrder;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export const fetchOrdersService = async (salesManId, page, limit, query) => {
  try {
    const orders = await margOrder
      .find({
        Sid: String(salesManId),
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
      Sid: String(salesManId),
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
