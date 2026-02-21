import mongoose from "mongoose";

const margOrderSchema = new mongoose.Schema(
  {
    Sid: {
      type: String,
      required: true,
    },
    OrderID: {
      type: String,
      required: true,
    },
    OrderNo: {
      type: String,
      required: true,
    },
    CustomerDetails: {
      type: Object,
      default: {},
    },
    ProductDetails: {
      type: Array,
      default: [],
    },
    PaymentDetails: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "margOrders",
  },
);

const margOrder = mongoose.model("margOrder", margOrderSchema);

export default margOrder;
