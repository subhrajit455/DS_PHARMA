import React, { useState } from 'react';
import PharmacyProductCard from '../components/ui/PharmacyProductCard';
import CartItem from '../components/ui/CartItem';
import OrderSummary from '../components/ui/OrderSummary';

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
  const [deliveryAddress, setDeliveryAddress] = useState({
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
    <div style={{ paddingTop: '140px', paddingBottom: '60px', width: '100%' }}>
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
      <div className="w-full" style={{ paddingRight: '6rem',paddingLeft: '6rem', paddingTop: '4rem' }}>
                <h2
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontSize: '23px',
                    fontWeight: 600,
                    color: '#000000',
                    marginBottom: '1rem'
                  }}
                >
                <span
              style={{
                borderBottom: '2px solid #111827',
                paddingBottom: '1px',
                display: 'inline-block',
                lineHeight: '1.2',
              }}
            >
              Suggested Items
            </span>
                  
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
                  {suggestedItems.map((item) => (
                    <PharmacyProductCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      originalPrice={item.originalPrice}
                      discount={item.discount}
                      quantity="1 piece"
                      imageUrl={item.image}
                    />
                  ))}
                </div>
              </div>
    </div>
  );
};

export default CartDetails;
