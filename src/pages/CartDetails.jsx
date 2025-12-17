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
import AddressesList from '@/components/features/profile/AddressesList';
import { useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/queries/useAddresses';



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
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Use addresses hook
  const { data: addressesData } = useAddresses();
  const userAddresses = addressesData?.data || [];

  const [deliveryAddress, setDeliveryAddress] = useState(null);

  // Initialize delivery address from saved addresses or user profile
  React.useEffect(() => {
      if (userAddresses.length > 0) {
          // Default to first address or default one
          const defaultAddr = userAddresses.find(a => a.isDefault) || userAddresses[0];
          setDeliveryAddress(defaultAddr);
      } else if (currentUser) {
          setDeliveryAddress({
              id: 'temp-1',
              name: currentUser.name || '',
              phone: currentUser.phone || '',
              address: currentUser.address ? `${currentUser.address.street}, ${currentUser.address.city}, ${currentUser.address.state} - ${currentUser.address.pincode}` : '',
              type: 'Home'
          });
      }
  }, [currentUser, addressesData]); // Depend on data fetch

  const updateQuantity = (id, newQuantity) => {
      updateCartItem({ productId: id, quantity: Math.max(1, newQuantity) });
  };

  const removeItem = (id) => {
    removeCartItem(id);
  };
  
  // Coupon Logic
  const handleApplyCoupon = () => {
      setCouponError('');
      setCouponSuccess('');
      
      if (!couponCode) {
          setCouponError('Please enter a coupon code');
          return;
      }
      
      const code = couponCode.toUpperCase();
      let discountAmount = 0;
      let couponType = '';
      
      const cartValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (code === 'SAVE10') {
          discountAmount = Math.round(cartValue * 0.10);
          couponType = '10% Off';
      } else if (code === 'FLAT50') {
          discountAmount = 50;
          couponType = 'Flat ₹50 Off';
      } else if (code === 'FREESHIP') {
         // Free shipping is handled in totals calculation
          couponType = 'Free Shipping';
          discountAmount = 0; // Discount is applied to delivery charge
      } else {
          setCouponError('Invalid coupon code');
          setAppliedCoupon(null);
          return;
      }
      
      setAppliedCoupon({
          code: code,
          discount: discountAmount,
          type: couponType
      });
      setCouponSuccess(`Coupon ${code} applied successfully!`);
  };

  const removeCoupon = () => {
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponSuccess('');
      setCouponError('');
  };

  const calculateTotals = () => {
    const totalCartValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Mock original price difference as "Discount"
    const productDiscount = cartItems.reduce((sum, item) => {
      const originalPrice = item.originalPrice || (item.price * 1.2); // Fake original price if missing
      return sum + ((originalPrice - item.price) * item.quantity);
    }, 0);
    
    const gst = Math.round(totalCartValue * 0.18);
    let deliveryCharges = totalCartValue > 500 ? 0 : 40;
    
    // Apply Coupon
    let couponDiscount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.code === 'FREESHIP') {
            deliveryCharges = 0;
        } else {
            couponDiscount = appliedCoupon.discount;
        }
    }

    const total = totalCartValue - 0 + gst + deliveryCharges - couponDiscount; // totalCartValue is usually discounted price? 
    // Usually: Total = Subtotal - Coupon + GST + Shipping
    // If cart items are already at discounted price, productDiscount is just for display ("You saved ...")

    return { 
        totalCartValue, 
        discount: Math.round(productDiscount), 
        coupon: couponDiscount, 
        gst, 
        deliveryCharges, 
        total: Math.max(0, total)
    };
  };

  const totals = calculateTotals();

  const handlePlaceOrder = (paymentMethod) => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    if (!deliveryAddress) {
        alert('Please select a delivery address');
        setShowAddressModal(true);
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
        appliedCoupon,
        deliveryAddress: {
            ...deliveryAddress,
            postalCode: deliveryAddress.pincode || deliveryAddress.postalCode // Normalize logic
        },
        paymentMethod,
        customerName: deliveryAddress.name,
        phone: deliveryAddress.phone,
        address: deliveryAddress.address,
    };

    placeOrder(orderData);
  };
  
  // Handlers for Address Modal
  const handleSelectAddress = (address) => {
      setDeliveryAddress(address);
      setShowAddressModal(false);
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
       
    {/* Address Selection Modal */}
    {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
                    <h2 className="text-lg font-bold font-gyrotrope">Select Delivery Address</h2>
                    <button 
                        onClick={() => setShowAddressModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-4">
                     <AddressesList 
                        addressesData={addressesData} 
                        // We need to pass mock/real mutations if AddressesList requires them to work
                        // For select, we just need the list. AddressesList handles add/edit internally.
                        addAddress={useAddAddress().mutate}
                        updateAddress={useUpdateAddress().mutate}
                        deleteAddress={useDeleteAddress().mutate}
                        isAddingAddress={false}
                     />
                     
                     <div className="mt-4 grid gap-3">
                         {userAddresses.map(addr => (
                             <div 
                                key={addr.id} 
                                onClick={() => handleSelectAddress(addr)}
                                className={`p-4 border rounded-xl cursor-pointer hover:border-emerald-500 transition-all ${deliveryAddress?.id === addr.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}
                             >
                                 <div className="flex items-center justify-between">
                                     <span className="font-semibold text-sm">{addr.type}</span>
                                     {deliveryAddress?.id === addr.id && <span className="text-emerald-600 text-xs font-bold">Selected</span>}
                                 </div>
                                 <p className="text-sm mt-1">{addr.name}, {addr.phone}</p>
                                 <p className="text-xs text-gray-500">{addr.address}, {addr.city}</p>
                             </div>
                         ))}
                     </div>
                </div>
            </div>
        </div>
    )}

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
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={removeCoupon}
              appliedCoupon={appliedCoupon}
              couponError={couponError}
              couponSuccess={couponSuccess}
              totals={totals}
              onOrderNow={handlePlaceOrder}
              onAddNewAddress={() => setShowAddressModal(true)}
              onChangeAddress={() => setShowAddressModal(true)} // Open modal to select/change
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

