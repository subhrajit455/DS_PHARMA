import React, { useState } from 'react';
import { PharmacyProductCard } from '@/components/features/product';
import { CartItem } from '@/components/features/cart';
import { OrderSummary } from '@/components/features/order';
import SuggestedItemsSection from '@/components/sections/SuggestedItemsSection';
import { useCartStore } from '@/store/useCartStore';

import { PRODUCTS } from '@/data/sampleData';

const CartDetails = () => {
  const { items: cartItems, updateQuantity: updateCartQuantity, removeItem: removeCartItem } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [deliveryAddress] = useState({
    name: 'Gourav Gupta',
    phone: '9999999999',
    address: 'A/B, Section Lane, Odisha, Noida, 744115'
  });

  // Use products from sampleData for suggestions
  const suggestedItems = PRODUCTS.slice(0, 5).map(p => ({
    ...p,
    // Ensure properties match what SuggestedItemsSection expects
    image: p.image || p.imageUrl 
  }));

  const updateQuantity = (id, delta) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      updateCartQuantity(id, Math.max(1, item.quantity + delta));
    }
  };

  const removeItem = (id) => {
    removeCartItem(id);
  };

  const calculateTotals = () => {
    const totalCartValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Assuming originalPrice is available in the item object, otherwise default to price
    const discount = cartItems.reduce((sum, item) => {
      const originalPrice = item.originalPrice || item.price;
      return sum + ((originalPrice - item.price) * item.quantity);
    }, 0);
    
    const coupon = 0; // Implement coupon logic if needed
    const gst = Math.round(totalCartValue * 0.18);
    const deliveryCharges = 40;
    const total = totalCartValue - discount - coupon + gst + deliveryCharges;

    return { totalCartValue, discount, coupon, gst, deliveryCharges, total };
  };

  const totals = calculateTotals();

  return (
    <div style={{ paddingTop: '60px' }}>
      <style>{` 
         @media (min-width: 768px) { 
           .orders-container { 
             padding-top: 80px !important; 
           } 
         }
         @media (max-width: 639px) {
           .cart-details-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
         @media (min-width: 640px) and (max-width: 1290px) {
           .cart-details-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
       `}</style>
    <div className="orders-container w-full pt-4 pb-16 lg:pt-32 lg:pb-16">
      <div className="cart-details-container w-full" style={{ maxWidth: '1200px', margin: '10px auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Cart Items */}
          <div className="lg:col-span-2">
            {/* Cart Items Header */}
            <div className="mb-5">
              <h1
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#000000',
                  marginBottom: '0',
                  letterSpacing: '-0.01em'
                }}
              >
                Cart Items
              </h1>
            </div>

            {/* Cart Items List */}
            <div 
              className="space-y-3" 
              style={{
                maxHeight: '500px',
                overflowY: 'auto',
                paddingRight: '5px',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE and Edge
              }}
            >
              <style>{`
                .space-y-3::-webkit-scrollbar {
                  display: none; /* Chrome, Safari, Opera */
                }
              `}</style>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    
                  />
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500" style={{ fontFamily: 'Gyrotrope', padding: '10px', marginTop: '10px' }}>Your cart is empty</p>
                </div>
              )}
            </div>


          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              deliveryAddress={deliveryAddress}
              couponCode={couponCode}
              onCouponChange={(e) => setCouponCode(e.target.value)}
              onApplyCoupon={() => console.log('Apply coupon:', couponCode)}
              totals={totals}
              onOrderNow={() => console.log('Order placed')}
              onAddNewAddress={() => console.log('Add new address')}
              onChangeAddress={() => console.log('Change address')}
            />
          </div>
        </div>
      

      {/* Suggested Items */}
      <SuggestedItemsSection
        title="Suggested Items"
        items={suggestedItems}
        className="w-full" 
        titleStyle={{
          fontSize: '22px',
          marginBottom: '1rem',
          textDecorationThickness: '2px',
          textDecorationColor: '#111827',
          lineHeight: '1.2'
        }}
        containerStyle={{ paddingTop: '1rem' }}
      />
      </div>
    </div>
    </div>
  );
};

export default CartDetails;
