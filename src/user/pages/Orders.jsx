import { userOrderUrl } from "@/config/userApi";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { OrderPDFButton } from "./OrderPDF";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAuthToken = () => {
    return localStorage.getItem("authToken") || sessionStorage.getItem("token");
  };
  // 🔹 Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${userOrderUrl.getAllOrders}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      setOrders(res.data.data || []);
      console.log("Fetched orders:", res.data.data);
    } catch (err) {
      setError("❌ Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getOrderItems = (order) =>
    order.orderItems || order.ProductDetails || [];
  const getOrderId = (order) =>
    order.OrderID || order.OrderNo || order._id || "";
  const getOrderStatus = (order) => order.Status || order.orderStatus || "";
  const getOrderTotal = (order) =>
    order.totalPrice ||
    order.PaymentDetails?.totalInvoiceValue ||
    order.PaymentDetails?.totalAmount ||
    0;
  const getOrderDiscount = (order) =>
    order.discount || order.PaymentDetails?.totalDiscountAmount || 0;
  const getOrderShipping = (order) => order.shippingPrice || 0;
  const getOrderPaymentMethod = (order) =>
    order.paymentMethod ||
    (order.PaymentDetails?.paymentmode === "1" ? "COD" : "PREPAID") ||
    "";

  // 🔹 Loading / Error states
  if (loading) return <p style={{ textAlign: "center" }}>Loading orders...</p>;

 if (error) {


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "linear-gradient(#fef2f2, #fff)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#ffffff",
          borderRadius: 16,
          padding: 28,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* Icon */}
       

        {/* Title */}
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            color:"green",
          }}
        >
          Please Login to view your orders
        </h2>

      
        {/* Buttons */}
        <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
          
         
            <button
              onClick={() => (window.location.href = "/login")}
              style={{
                padding: "10px 18px",
                backgroundColor: "green",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Login
            </button>
         
        </div>
      </div>
    </div>
  );
}
  if (!selectedOrder) {
    return (
      <div
        className=""
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "#ffffff",
          paddingTop: 104,
          paddingBottom: 64,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <div style={{ width: "100%", maxWidth: 640 }}>
          <h2
            className=""
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginBottom: 32,
              textAlign: "center",
              color: "#115e59",
              fontFamily: "Gyrotrope",
            }}
          >
            My Orders
          </h2>
          {orders.length === 0 && (
            <div
              className=""
              style={{
                textAlign: "center",
                color: "#6b7280",
                paddingTop: 48,
                paddingBottom: 48,
                fontSize: 18,
              }}
            >
              No orders found.
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {orders.map((order) => {
              const items = getOrderItems(order);
              const totalItems = items.reduce(
                (sum, item) => sum + (item.Quantity || item.quantity || 0),
                0,
              );
              return (
                <div
                  key={getOrderId(order) || order._id}
                  onClick={() => setSelectedOrder(order)}
                  className=""
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #ccfbf1",
                    borderRadius: 12,
                    padding: 24,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "box-shadow 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#0f766e" }}>
                      Order ID:
                    </span>
                    <span style={{ color: "#374151" }}>
                      #{getOrderId(order)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "#4b5563" }}>
                      Items:{" "}
                      <span style={{ fontWeight: 500 }}>{totalItems}</span>
                    </span>
                    <span style={{ color: "#4b5563" }}>
                      Status:{" "}
                      <span style={{ fontWeight: 500 }}>
                        {getOrderStatus(order)}
                      </span>
                    </span>
                    <span style={{ color: "#4b5563" }}>
                      Total:{" "}
                      <span style={{ fontWeight: 500 }}>
                        ₹{getOrderTotal(order)}
                      </span>
                    </span>
                    <span style={{ color: "#4b5563" }}>
                      Date:{" "}
                      <span style={{ fontWeight: 500 }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <OrderPDFButton order={order} />
                    </div>
                  </div>                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className=""
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#ffffff",
        paddingTop: 104,
        paddingBottom: 64,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <div style={{ width: "100%", maxWidth: 640 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            gap: 12,
          }}
        >
          <button
            onClick={() => setSelectedOrder(null)}
            className=""
            style={{
              padding: "8px 16px",
              backgroundColor: "#14b8a6",
              color: "#ffffff",
              borderRadius: 8,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            ← Back to Orders
          </button>

          <div>
            <OrderPDFButton order={selectedOrder} />
          </div>
        </div>
        <h2
          className=""
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            color: "#115e59",
          }}
        >
          Order Details
        </h2>
        <div
          className=""
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ccfbf1",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontWeight: 600, color: "#0f766e" }}>Order ID:</span>
            <span style={{ color: "#374151" }}>
              #{getOrderId(selectedOrder)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span style={{ color: "#4b5563" }}>
              Status:{" "}
              <span style={{ fontWeight: 500 }}>
                {getOrderStatus(selectedOrder)}
              </span>
            </span>
            <span style={{ color: "#4b5563" }}>
              Payment:{" "}
              <span style={{ fontWeight: 500 }}>
                {getOrderPaymentMethod(selectedOrder)}
              </span>
            </span>
            <span style={{ color: "#4b5563" }}>
              Total:{" "}
              <span style={{ fontWeight: 500 }}>
                ₹{getOrderTotal(selectedOrder)}
              </span>
            </span>
            <span style={{ color: "#4b5563" }}>
              Shipping:{" "}
              <span style={{ fontWeight: 500 }}>
                ₹{getOrderShipping(selectedOrder)}
              </span>
            </span>
            <span style={{ color: "#4b5563" }}>
              Discount:{" "}
              <span style={{ fontWeight: 500 }}>
                ₹{getOrderDiscount(selectedOrder)}
              </span>
            </span>
            <span style={{ color: "#4b5563" }}>
              Date:{" "}
              <span style={{ fontWeight: 500 }}>
                {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </span>
          </div>
        </div>
        <h3
          className=""
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#0f766e",
            marginBottom: 12,
          }}
        >
          Items
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {getOrderItems(selectedOrder).map((item, index) => (
            <div
              key={index}
              className=""
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                border: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                padding: 16,
                borderRadius: 8,
              }}
            >
              {/* ✅ Product Image */}
              <img
                src={item.image || item.imageUrl || "/placeholder.png"}
                alt={item.name || item.code || "Product"}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  flexShrink: 0,
                }}
                onError={(e) => {
                  e.target.src = "/placeholder.png"; // fallback image
                }}
              />

              {/* ✅ Product Details */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 8,
                  width: "100%",
                }}
              >
                <span style={{ color: "#374151" }}>
                  Product Code:{" "}
                  <span style={{ fontWeight: 500 }}>
                    {item.productCode || item.code || item.rid}
                  </span>
                </span>

                <span style={{ color: "#374151" }}>
                  Product Name:{" "}
                  <span style={{ fontWeight: 500 }}>{item.name}</span>
                </span>

                <span style={{ color: "#374151" }}>
                  Qty:{" "}
                  <span style={{ fontWeight: 500 }}>
                    {item.Quantity || item.quantity || 0}
                  </span>
                </span>

                <span style={{ color: "#374151" }}>
                  Free:{" "}
                  <span style={{ fontWeight: 500 }}>{item.Free || 0}</span>
                </span>

                <span style={{ color: "#374151", fontWeight: 600 }}>
                  ₹{item.price || item.Rate || item.MRP || 0}
                </span>
              </div>
            </div>
          ))}
        </div>

        <h3
          className=""
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#0f766e",
            marginBottom: 12,
          }}
        >
          Delivery Address
        </h3>
        <div
          className=""
          style={{
            border: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <p>
            {selectedOrder.CustomerDetails?.Address || selectedOrder.address}
          </p>
          <p>
            {selectedOrder.CustomerDetails?.shipAdd1 || selectedOrder.street}
          </p>
          <p>{selectedOrder.CustomerDetails?.shipname || ""}</p>
          <p>{selectedOrder.CustomerDetails?.shipAdd2 || ""}</p>
          <p>{selectedOrder.CustomerDetails?.shipAdd3 || ""}</p>
          <p>{selectedOrder.CustomerDetails?.CustName || ""}</p>
          <p>{selectedOrder.CustomerDetails?.CustMobile || ""}</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;
