import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    Sid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
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
    OTP: {
      type: String,
    },
    Status: {
      type: String,
      enum: [
        'Pending',
        'Processing',
        'Confirmed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Rejected',
      ],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    collection: 'orders',
  },
);

const Orders = mongoose.model('orders', orderSchema);

export default Orders;
