import React from 'react';

const OrderSummary = ({ 
  deliveryAddress, 
  couponCode, 
  onCouponChange, 
  onApplyCoupon,
  totals,
  onOrderNow,
  onAddNewAddress,
  onChangeAddress
}) => {
  return (
    <div className="sticky top-32 space-y-3">
      {/* Delivery Address */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
        border: '1px solid #E5E7EB',
        marginBottom: '5px'
      }}>
        <h3
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '14px',
            fontWeight: 600,
            color: '#000000',
            marginBottom: '10px',
            letterSpacing: '-0.01em'
          }}
        >
          Delivery Address
        </h3>
        <div
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '12px',
            fontWeight: 400,
            color: '#374151',
            lineHeight: '1.5',
            marginBottom: '12px'
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '2px', color: '#000000' }}>
            {deliveryAddress.name} - {deliveryAddress.phone}
          </div>
          <div>{deliveryAddress.address}</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddNewAddress}
            className="flex-1 transition-colors cursor-pointer hover:opacity-90"
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: '#A5E8DC',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 10px',
              height: '30px'
            }}
          >
            + Add New Address
          </button>
          <button
            onClick={onChangeAddress}
            className="transition-colors cursor-pointer hover:bg-gray-50"
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '11px',
              fontWeight: 600,
              color: '#000000',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              padding: '6px 10px',
              height: '30px',
              backgroundColor: 'transparent'
            }}
          >
            Change Address
          </button>
        </div>
      </div>

      {/* Apply Coupon */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
        border: '1px solid #E5E7EB',
        marginBottom: '5px'
      }}>
        <h3
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '13px',
            fontWeight: 600,
            color: '#F97316',
            marginBottom: '10px',
            letterSpacing: '-0.01em'
          }}
        >
          Apply Coupon
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={onCouponChange}
            placeholder="Enter coupon code"
            className="flex-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '11px',
              padding: '6px 10px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              height: '30px'
            }}
          />
          <button
            onClick={onApplyCoupon}
            className="transition-colors cursor-pointer hover:opacity-90"
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: '#F97316',
              borderRadius: '8px',
              padding: '6px 10px',
              height: '30px',
              border: 'none',
              color: '#FFFFFF',
            }}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
        border: '1px solid #E5E7EB'
      }}>
        <h3
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '13px',
            fontWeight: 600,
            color: '#000000',
            marginBottom: '12px',
            letterSpacing: '-0.01em'
          }}
        >
          Payment Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="flex justify-between">
            <span
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '11px',
                fontWeight: 400,
                color: '#6B7280'
              }}
            >
              Total Cart Value
            </span>
            <span
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '11px',
                fontWeight: 600,
                color: '#000000'
              }}
            >
              ₹{totals.totalCartValue}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '11px',
                fontWeight: 400,
                color: '#6B7280'
              }}
            >
              Discount
            </span>
            <span
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '11px',
                fontWeight: 600,
                color: '#10B981'
              }}
            >
              -₹{totals.discount}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '11px',
                fontWeight: 400,
                color: '#6B7280'
              }}
            >
              Coupon
            </span>
            <span
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '11px',
                fontWeight: 600,
                color: '#10B981'
              }}
            >
              -₹{totals.coupon}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '11px',
                fontWeight: 400,
                color: '#6B7280'
              }}
            >
              GST
            </span>
            <span
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '11px',
                fontWeight: 600,
                color: '#000000'
              }}
            >
              +₹{totals.gst}
            </span>
          </div>
          <div className="flex justify-between">
            <span
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '11px',
                fontWeight: 400,
                color: '#6B7280'
              }}
            >
              Delivery Charges
            </span>
            <span
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '11px',
                fontWeight: 600,
                color: '#000000'
              }}
            >
              +₹{totals.deliveryCharges}
            </span>
          </div>
          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '10px', marginTop: '10px' }}>
            <div className="flex justify-between">
              <span
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#000000'
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#000000'
                }}
              >
                ₹{totals.total}
              </span>
            </div>
          </div>
        </div>

        {/* Order Now Button */}
        <button
          onClick={onOrderNow}
          className="w-full transition-all duration-200 hover:opacity-90 cursor-pointer"
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '14px',
            fontWeight: 600,
            backgroundColor: '#FF7A59',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '8px',
            marginTop: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)'
          }}
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
