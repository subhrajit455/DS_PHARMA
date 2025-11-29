import React, { useState } from 'react';
import { PharmacyProductCard } from '@/components/features/product';
import { CartItem } from '@/components/features/cart';
import { OrderSummary } from '@/components/features/order';
import SuggestedItemsSection from '@/components/sections/SuggestedItemsSection';

const CartDetails = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules',
      price: 1500,
      originalPrice: 1800,
      discount: 25,
      quantity: 1,
      image: '/src/assets/images/medicine.jpeg'
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [deliveryAddress] = useState({
    name: 'Bikram Dumriya',
    phone: '9999999999',
    address: 'A/B, Section Lane, Odisha, Noida, 744115'
  });

  const suggestedItems = [
    {
      id: 1,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 2,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 3,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 4,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 5,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    }
  ];

  const updateQuantity = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    const totalCartValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
    const coupon = 0;
    const gst = Math.round(totalCartValue * 0.18);
    const deliveryCharges = 40;
    const total = totalCartValue - discount - coupon + gst + deliveryCharges;

    return { totalCartValue, discount, coupon, gst, deliveryCharges, total };
  };

  const totals = calculateTotals();

  return (
    <div className="w-full pt-4 pb-16 lg:pt-32 lg:pb-16">
      <div className="w-full" style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            <div className="space-y-3">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
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
        containerStyle={{ paddingRight: '1rem', paddingLeft: '1rem', paddingTop: '2rem' }}
      />
    </div>
  );
};

export default CartDetails;
