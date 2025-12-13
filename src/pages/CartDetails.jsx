import React, { useState } from 'react';

import { PharmacyProductCard } from '@/components/features/product';
import { CartItem } from '@/components/features/cart';
import { OrderSummary } from '@/components/features/order';
import SuggestedItemsSection from '@/components/sections/SuggestedItemsSection';
import useDataStore from '@/store/useDataStore';
import { useUpdateCart } from '@/hooks/mutations/useUpdateCart';
import { useRemoveFromCart } from '@/hooks/mutations/useRemoveFromCart';
import { usePlaceOrder } from '@/hooks/mutations/usePlaceOrder';
import { useProducts } from '@/hooks/queries/useProducts';



const CartDetails = () => {
  // Use global data store
  const cartItems = useDataStore((state) => state.cart);
  const currentUser = useDataStore((state) => state.currentUser);
  
  // API Hooks
  const { mutate: updateCartItem } = useUpdateCart();
  const { mutate: removeCartItem } = useRemoveFromCart();
  const { mutate: placeOrder, isPending: isPlacingOrder } = usePlaceOrder();
  
  // Fetch suggested items
  const { data: suggestionsData } = useProducts({ limit: 5 });
  const suggestedItems = suggestionsData?.data || [];

  const [couponCode, setCouponCode] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState({
    id: 1,
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address ? `${currentUser.address.street}, ${currentUser.address.city}, ${currentUser.address.state} - ${currentUser.address.pincode}` : '',
    type: 'Home'
  });

  // Sync address when user loads (e.g. refresh)
  React.useEffect(() => {
      if (currentUser) {
          setDeliveryAddress({
              id: 1,
              name: currentUser.name || '',
              phone: currentUser.phone || '',
              address: currentUser.address ? `${currentUser.address.street}, ${currentUser.address.city}, ${currentUser.address.state} - ${currentUser.address.pincode}` : '',
              type: 'Home'
          });
      }
  }, [currentUser]);

  const updateQuantity = (id, newQuantity) => {
      // Our refactored hook expects { productId, quantity }
      updateCartItem({ productId: id, quantity: Math.max(1, newQuantity) });
  };

  const removeItem = (id) => {
    removeCartItem(id);
  };

  const calculateTotals = () => {
    const totalCartValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = cartItems.reduce((sum, item) => {
      // Assuming item has originalPrice or we calculate it. 
      // If backend doesn't send originalPrice, we might default to price (0 discount).
      const originalPrice = item.originalPrice || item.price;
      return sum + ((originalPrice - item.price) * item.quantity);
    }, 0);
    
    const coupon = 0; 
    const gst = Math.round(totalCartValue * 0.18);
    const deliveryCharges = totalCartValue > 0 ? 40 : 0;
    const total = totalCartValue - discount - coupon + gst + deliveryCharges;

    return { totalCartValue, discount, coupon, gst, deliveryCharges, total };
  };

  const totals = calculateTotals();

  const handlePlaceOrder = (paymentMethod) => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name || item.productName,
          productName: item.name || item.productName,
          price: item.price,
          quantity: item.quantity,
          image: item.image || item.imageUrl,
        })),
        totals,
        deliveryAddress,
        paymentMethod,
        customerName: deliveryAddress.name,
        phone: deliveryAddress.phone,
        address: deliveryAddress.address,
    };

    placeOrder(orderData);
  };

  return (
    <div style={{ paddingTop: '4rem' }}>
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
      <div className="cart-details-container w-full" style={{ maxWidth: '1280px', margin: '10px auto' }}>
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
                Cart Items ({cartItems.length})
              </h1>
            </div>

            {/* Cart Items List */}
            <div 
              className="space-y-3" 
              style={{
                maxHeight: '750px',
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
                    // CartItem likely calls this with (id, newQuantity)
                    onUpdateQuantity={(id, newQty) => updateQuantity(id, newQty)}
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
              onOrderNow={handlePlaceOrder}
              onAddNewAddress={() => console.log('Add new address')}
              onChangeAddress={(newAddress) => setDeliveryAddress(newAddress)}
              isPlacingOrder={isPlacingOrder}
              cartItems={cartItems}
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

