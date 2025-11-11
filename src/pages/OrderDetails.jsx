import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Order data
  const order = {
    id: "964368966",
    trackingId: "EKFC9469943995",
    courierName: "EKART",
    productName: "Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules",
    price: 1500,
    quantity: 1,
    image: "/src/assets/images/medicine.jpeg",
    status: "On the Way",
    expectedDelivery: "18th Dec, 2025",
    deliveryPartner: "Pickup Up Your Courier. Will Be Delivered Soon.",
    contactAgent: "_",
    pin: "_",
    otp: "_",
    customerAddress: {
      name: "Bikram Dumriya",
      phone: "9999999999",
      address: "A/B, Section Lane, Odisha, Noida, 744115",
    },
    appliedCoupon: {
      address: "A/B, Section Lane, Odisha, Noida, 744115",
    },
    paymentBreakdown: {
      totalCartValue: 1500,
      discount: 1000,
      coupon: 200,
      gst: 94,
      deliveryCharges: 40,
      total: 1364,
    },
    timeline: [
      { status: "Order Placed", completed: true },
      { status: "On The Way", completed: true, active: true },
      { status: "Expected Delivery", date: "18th Dec, 2025", completed: false },
      { status: "Out For Delivery", completed: false },
      { status: "Delivered", completed: false },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main
        className="grow"
        style={{ paddingTop: "140px", paddingBottom: "60px" }}
      >
        <div
          className="w-full"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Section - Cart Items */}
              <div className="lg:col-span-2">
                {/* Cart Items Header */}
                <div className="mb-6">
                  <h1
                    style={{
                      fontFamily: "Gyrotrope",
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#000000",
                    }}
                  >
                    Order Details
                  </h1>
                </div>

                {/* Order Card */}
                <div
                  className="bg-white rounded-lg p-6 shadow-sm border min-h-[350px] border-gray-200 mb-6"
                  style={{ padding: "10px" }}
                >
                  {/* Product Info */}
                  <div className="flex gap-4 mb-6">
                    <div>
                      <div
                        className="shrink-0 bg-linear-to-br from-sky-100 to-sky-200 rounded-lg overflow-hidden"
                        style={{ width: "120px", height: "120px" }}
                      >
                        <img
                          src={order.image}
                          alt={order.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Quantity */}
                      <div className="flex justify-center mt-4">
                        <p
                          style={{
                            fontFamily: "Gyrotrope",
                            fontSize: "14px",
                            color: "#6B7280",
                          }}
                        >
                          Qty: {order.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3
                        style={{
                          fontFamily: "Gyrotrope",
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "#000000",
                          marginBottom: "12px",
                        }}
                      >
                        {order.productName}
                      </h3>
                      <p
                        style={{
                          fontFamily: "Gyrotrope",
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#000000",
                          marginBottom: "16px",
                        }}
                      >
                        ₹{order.price}
                      </p>

                      {/* Order Timeline */}
                      <div className="relative">
                        {/* Progress Bar */}
                        <div className="flex items-center justify-between mb-2">
                          {order.timeline.map((step, index) => (
                            
                            <div
                              key={index}
                              className="flex flex-col items-center flex-1 relative"
                            >
                              {/* Connector Line */}
                              {index < order.timeline.length - 1 && (
                                <div
                                  className="absolute top-3 left-1/2 w-full h-0.5"
                                  style={{
                                    backgroundColor: step.completed
                                      ? "#10B981"
                                      : "#D1D5DB",
                                    zIndex: 0,
                                  }}
                                />
                              )}

                              {/* Status Dot */}
                              <div
                                className="w-6 h-6 rounded-full relative z-10 mb-2"
                                style={{
                                  backgroundColor: step.completed
                                    ? "#10B981"
                                    : "#D1D5DB",
                                  border: step.active
                                    ? "3px solid #059669"
                                    : "none",
                                }}
                              />

                              {/* Status Label */}
                              <p
                                style={{
                                  fontFamily: "Gyrotrope",
                                  fontSize: "11px",
                                  fontWeight: step.active ? 600 : 400,
                                  color:
                                    step.completed || step.active
                                      ? "#000000"
                                      : "#9CA3AF",
                                  textAlign: "center",
                                  maxWidth: "100px",
                                  margin: "5px 0",
                                }}
                              >
                                {step.status}
                              </p>
                              <div>
                              {step.date && (
                                <p
                                  style={{
                                    fontFamily: "Gyrotrope",
                                    fontSize: "10px",
                                    color: "#059669",
                                    textAlign: "center",
                                    marginTop: "5px",
                                  }}
                                >
                                  {step.date}
                                </p>
                              )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Partner Message */}
                        <div className="m-14 text-center">
                          <p
                            style={{
                              fontFamily: "Gyrotrope",
                              fontSize: "12px",
                              color: "#059669",
                              fontWeight: 500,
                              marginTop: "5px",
                            }}
                          >
                            Delivery Partner: {order.deliveryPartner}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-gray-200">
                    <div>
                      <p
                        style={{
                          fontFamily: "Gyrotrope",
                          fontSize: "13px",
                          color: "#6B7280",
                          marginBottom: "4px",
                        }}
                      >
                        Order ID:{" "}
                        <span style={{ color: "#000000", fontWeight: 600 }}>
                          {order.id}
                        </span>
                      </p>
                      <p
                        style={{
                          fontFamily: "Gyrotrope",
                          fontSize: "13px",
                          color: "#6B7280",
                          marginBottom: "4px",
                        }}
                      >
                        Tracking ID:{" "}
                        <span style={{ color: "#000000", fontWeight: 600 }}>
                          {order.trackingId}
                        </span>
                      </p>
                      <p
                        style={{
                          fontFamily: "Gyrotrope",
                          fontSize: "13px",
                          color: "#6B7280",
                        }}
                      >
                        Courier Name:{" "}
                        <span style={{ color: "#000000", fontWeight: 600 }}>
                          {order.courierName}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "Gyrotrope",
                          fontSize: "13px",
                          color: "#6B7280",
                          marginBottom: "4px",
                        }}
                      >
                        Contact Agent:{" "}
                        <span style={{ color: "#000000", fontWeight: 600 }}>
                          {order.contactAgent}
                        </span>
                      </p>
                      <p
                        style={{
                          fontFamily: "Gyrotrope",
                          fontSize: "13px",
                          color: "#6B7280",
                          marginBottom: "4px",
                        }}
                      >
                        Pin:{" "}
                        <span style={{ color: "#000000", fontWeight: 600 }}>
                          {order.pin}
                        </span>
                      </p>
                      <p
                        style={{
                          fontFamily: "Gyrotrope",
                          fontSize: "13px",
                          color: "#6B7280",
                        }}
                      >
                        OTP:{" "}
                        <span style={{ color: "#000000", fontWeight: 600 }}>
                          {order.otp}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate("/orders")}
                      className="px-6 py-2 rounded-md font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{
                        fontFamily: "Gyrotrope",
                        fontSize: "14px",
                        color: "#000000",
                      }}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Section - Delivery & Payment Info */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 space-y-4">
                  {/* Delivery Address */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <h3
                      style={{
                        fontFamily: "Gyrotrope",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#000000",
                        marginBottom: "12px",
                      }}
                    >
                      Delivery Address
                    </h3>
                    <div
                      style={{
                        fontFamily: "Gyrotrope",
                        fontSize: "14px",
                        color: "#374151",
                        lineHeight: "1.6",
                      }}
                    >
                      <p style={{ fontWeight: 600, marginBottom: "4px" }}>
                        {order.customerAddress.name} -{" "}
                        {order.customerAddress.phone}
                      </p>
                      <p>{order.customerAddress.address}</p>
                    </div>
                    <button
                      className="mt-3 w-full px-4 py-2 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{
                        fontFamily: "Gyrotrope",
                        fontSize: "14px",
                        color: "#000000",
                      }}
                    >
                      Change Address
                    </button>
                  </div>

                  {/* Applied Coupon */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <h3
                      style={{
                        fontFamily: "Gyrotrope",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#F97316",
                        marginBottom: "12px",
                      }}
                    >
                      Applied Coupon
                    </h3>
                    <p
                      style={{
                        fontFamily: "Gyrotrope",
                        fontSize: "14px",
                        color: "#374151",
                      }}
                    >
                      {order.appliedCoupon.address}
                    </p>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <h3
                      style={{
                        fontFamily: "Gyrotrope",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#000000",
                        marginBottom: "12px",
                      }}
                    >
                      Payment Breakdown
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span
                          style={{
                            fontFamily: "Gyrotrope",
                            fontSize: "14px",
                            color: "#6B7280",
                          }}
                        >
                          Total Cart Value
                        </span>
                        <span
                          style={{
                            fontFamily: "Gyrotrope",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#000000",
                          }}
                        >
                          ₹{order.paymentBreakdown.totalCartValue}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            fontFamily: "Gyrotrope",
                            fontSize: "14px",
                            color: "#6B7280",
                          }}
                        >
                          Discount
                        </span>
                        <span
                          style={{
                            fontFamily: "Gyrotrope",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#10B981",
                          }}
                        >
                          -₹{order.paymentBreakdown.discount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            fontFamily: "Gyrotrope",
                            fontSize: "14px",
                            color: "#6B7280",
                          }}
                        >
                          Coupon
                        </span>
                        <span
                          style={{
                            fontFamily: "Gyrotrope",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#10B981",
                          }}
                        >
                          -₹{order.paymentBreakdown.coupon}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            fontFamily: "Gyrotrope",
                            fontSize: "14px",
                            color: "#6B7280",
                          }}
                        >
                          GST
                        </span>
                        <span
                          style={{
                            fontFamily: "Gyrotrope",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#000000",
                          }}
                        >
                          +₹{order.paymentBreakdown.gst}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          style={{
                            fontFamily: "Gyrotrope",
                            fontSize: "14px",
                            color: "#6B7280",
                          }}
                        >
                          Delivery Charges
                        </span>
                        <span
                          style={{
                            fontFamily: "Gyrotrope",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#000000",
                          }}
                        >
                          +₹{order.paymentBreakdown.deliveryCharges}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span
                            style={{
                              fontFamily: "Gyrotrope",
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "#000000",
                            }}
                          >
                            Total
                          </span>
                          <span
                            style={{
                              fontFamily: "Gyrotrope",
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "#000000",
                            }}
                          >
                            ₹{order.paymentBreakdown.total}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="m-[15px] flex justify-between w-[65%] border bg-white border-gray-200 ">
            {/* Contact Customer Care */}
              <div className="mt-4 pt-4">
                <p
                  style={{
                    fontFamily: "Gyrotrope",
                    fontSize: "14px",
                    color: "#6B7280",
                  }}
                >
                  Contact Customer Care
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  className="px-6 py-2 rounded-md font-semibold transition-colors cursor-pointer"
                  style={{
                    fontFamily: "Gyrotrope",
                    fontSize: "14px",
                    backgroundColor: "#10B981",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "8px 10px"
                  }}
                >
                  Share Order Details
                </button>
                <button
                  className="px-6 py-2 rounded-md font-semibold transition-colors cursor-pointer"
                  style={{
                    fontFamily: "Gyrotrope",
                    fontSize: "14px",
                    backgroundColor: "#F97316",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "8px 10px"
                  }}
                >
                  Download Receipt
                </button>
              </div>

              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
