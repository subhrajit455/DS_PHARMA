import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PharmacyProductCard } from '@/user/components/product';
import { CartItem } from '@/user/components/cart';
import { OrderSummary } from '@/user/components/order';
import SuggestedItemsSection from '@/user/components/sections/SuggestedItemsSection';
import useDataStore from '@/store/useDataStore';
import { useUpdateCart } from '@/shared/hooks/mutations/useUpdateCart';
import { useRemoveFromCart } from '@/shared/hooks/mutations/useRemoveFromCart';
import { usePlaceOrder } from '@/shared/hooks/mutations/usePlaceOrder';
import { useProducts } from '@/shared/hooks/queries/useProducts';
import AddressForm from '@/shared/components/common/AddressForm';
import { useAddresses, useAddAddress } from '@/shared/hooks/queries/useAddresses';
import { X, MapPin, Home, Briefcase, Plus } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

const CartDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Use global data store
  const cartItems = useDataStore((state) => state.cart);
  const currentUser = useDataStore((state) => state.currentUser);
  
  // API Hooks
  const { mutate: updateCartItem } = useUpdateCart();
  const { mutate: removeCartItem } = useRemoveFromCart();
  const { mutate: placeOrder, isPending: isPlacingOrder } = usePlaceOrder();
  const { mutate: addAddress, isPending: isAddingAddress } = useAddAddress();
  
  // Fetch suggested items
  const { data: suggestionsData } = useProducts({ limit: 5 });
  const suggestedItems = suggestionsData?.data || [];

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [modalMode, setModalMode] = useState('select'); // 'select' or 'add'
  const { success: toastSuccess, error: toastError } = useToastStore();

  // Use addresses hook
  const { data: addressesData } = useAddresses();
  const userAddresses = useMemo(() => addressesData?.data || [], [addressesData]);

  const [deliveryAddress, setDeliveryAddress] = useState(null);

  // Initialize delivery address from saved addresses or user profile
  React.useEffect(() => {
      // Only auto-select if no address is currently selected
      if (!deliveryAddress) {
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
      }
  }, [currentUser, addressesData, deliveryAddress, userAddresses]); 

  const updateQuantity = (id, newQuantity) => {
      updateCartItem({ productId: id, quantity: Math.max(1, newQuantity) });
  };

  const removeItem = (id) => {
    removeCartItem(id);
  };
  
  // Reactive Coupon Logic - Ensures discount is always accurate
  const handleApplyCoupon = () => {
      if (!couponCode) {
          toastError('Please enter a coupon code');
          return;
      }
      const code = couponCode.toUpperCase();
      const cartValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Validation logic (Recalculation happens in calculateTotals)
      if (code === 'SAVE10') {
          if (cartValue < 500) {
              toastError('Min order value for SAVE10 is ₹500');
              return;
          }
          setAppliedCoupon({ code, type: '10% Off' });
      } else if (code === 'FLAT50') {
          if (cartValue < 300) {
              toastError('Min order value for FLAT50 is ₹300');
              return;
          }
          setAppliedCoupon({ code, type: 'Flat ₹50 Off' });
      } else if (code === 'FREESHIP') {
          setAppliedCoupon({ code, type: 'Free Shipping' });
      } else {
          toastError('Invalid coupon code');
          return;
      }
      toastSuccess(`Coupon ${code} applied!`);
  };

  // Re-validate coupon when cart changes
  React.useEffect(() => {
      if (appliedCoupon) {
          const cartValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          if (appliedCoupon.code === 'SAVE10' && cartValue < 500) {
              setAppliedCoupon(null);
              toastError('Coupon SAVE10 removed (min order value ₹500 not met)');
          } else if (appliedCoupon.code === 'FLAT50' && cartValue < 300) {
              setAppliedCoupon(null);
              toastError('Coupon FLAT50 removed (min order value ₹300 not met)');
          }
      }
  }, [cartItems, appliedCoupon, toastError]);

  const removeCoupon = () => {
      setAppliedCoupon(null);
      setCouponCode('');
  };

  const totals = useMemo(() => {
    const totalCartValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const productDiscount = cartItems.reduce((sum, item) => {
      const originalPrice = item.originalPrice || (item.price * 1.2);
      return sum + ((originalPrice - item.price) * item.quantity);
    }, 0);
    
    const gst = Math.round(totalCartValue * 0.18);
    
    // Delivery Charge Logic
    // 1. Empty Cart -> 0
    // 2. Cart Value > 500 -> 0 (Free Shipping)
    // 3. Else -> 40 (Standard Fee)
    let deliveryCharges = (cartItems.length > 0 && totalCartValue <= 500) ? 40 : 0;
    let couponDiscount = 0;

    if (appliedCoupon) {
        if (appliedCoupon.code === 'FREESHIP') {
            deliveryCharges = 0;
        } else if (appliedCoupon.code === 'SAVE10') {
            couponDiscount = Math.round(totalCartValue * 0.10);
        } else if (appliedCoupon.code === 'FLAT50') {
            couponDiscount = 50;
        }
    }

    const total = totalCartValue + gst + deliveryCharges - couponDiscount;
    return { 
        totalCartValue, 
        discount: Math.round(productDiscount), 
        coupon: couponDiscount, 
        gst, 
        deliveryCharges, 
        total: Math.max(0, total) 
    };
  }, [cartItems, appliedCoupon]);

  const handlePlaceOrder = (paymentMethod) => {
    if (!currentUser) {
      toastError('Please login to place your order');
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
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
         @media (min-width: 768px) { .orders-container { padding-top: 80px !important; } }
         @media (max-width: 639px) { .cart-details-container { padding-left: 5px !important; padding-right: 5px !important; } }
       `}</style>
       
    {/* Address Management Modal */}
    {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" style={{ padding: '5px' }}>
             <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" style={{padding: '10px'}}>
                 {/* Modal Header */}
                 <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50" style={{paddingBottom: '10px'}}>
                     <h3 className="text-xl font-bold text-gray-900">
                        {modalMode === 'add' ? 'Add New Address' : 'Select Delivery Address'}
                     </h3>
                     <button 
                        onClick={() => setShowAddressModal(false)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                     >
                        <X size={20} className="text-gray-500" />
                     </button>
                 </div>

                 {/* Modal Content */}
                 <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar" style={{padding: '5px'}}>
                     {modalMode === 'add' ? (
                         <AddressForm 
                            style={{padding: '5px'}}
                            onSave={(data) => {
                                addAddress(data, {
                                    onSuccess: (newAddr) => {
                                        setDeliveryAddress(newAddr.data || newAddr);
                                        setShowAddressModal(false);
                                    }
                                });
                            }}
                            onCancel={() => setModalMode('select')}
                            isSaving={isAddingAddress}
                         />
                     ) : (
                         <div className="space-y-4">
                             <div className="flex justify-between items-center mb-4">
                                <p className="text-sm text-gray-500">Choose from your saved addresses</p>
                                <button 
                                    onClick={() => setModalMode('add')}
                                    className="flex items-center gap-1 text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-colors"
                                >
                                    <Plus size={16} />
                                    <span style={{marginTop: '5px'}}>Add New Address</span>
                                </button>
                             </div>
                             
                             <div className="grid grid-cols-1 gap-3" style={{padding: '5px'}}>
                                 {userAddresses.length > 0 ? (
                                     userAddresses.map((addr) => (
                                         <div 
                                             style={{padding: '5px'}}
                                             key={addr.id}
                                             onClick={() => {
                                                 setDeliveryAddress(addr);
                                                 setShowAddressModal(false);
                                             }}
                                             className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                                                 deliveryAddress?.id === addr.id 
                                                 ? 'border-emerald-500 bg-emerald-50/50' 
                                                 : 'border-gray-100 bg-white hover:border-emerald-200'
                                             }`}
                                         >
                                             <div className="flex justify-between items-start">
                                                 <div className="flex items-center gap-2">
                                                     <div className={`p-2 rounded-lg ${
                                                         addr.type === 'Work' ? 'bg-purple-100 text-purple-600' : 
                                                         addr.type === 'Home' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                                                     }`}>
                                                        {addr.type === 'Work' ? <Briefcase size={14} /> : 
                                                         addr.type === 'Home' ? <Home size={14} /> : <MapPin size={14} />}
                                                     </div>
                                                     <span className="font-bold text-gray-900">{addr.type}</span>
                                                 </div>
                                                 {deliveryAddress?.id === addr.id && (
                                                     <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold" style={{padding: '2px 5px'}}>Selected</span>
                                                 )}
                                             </div>
                                             <div className="mt-3 space-y-1">
                                                <p className="text-sm font-bold text-gray-800">{addr.name}</p>
                                                <p className="text-xs text-gray-600 leading-relaxed tabular-nums">{addr.phone}</p>
                                                <p className="text-xs text-gray-500 line-clamp-2">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                                             </div>
                                         </div>
                                     ))
                                 ) : (
                                     <div className="text-center flex flex-col items-center justify-center py-12">
                                         <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
                                         <p className="text-gray-500">No saved addresses found</p>
                                         <button 
                                            onClick={() => setModalMode('add')}
                                            className="mt-4 text-emerald-600 font-bold hover:underline"
                                         >
                                             Add your first address
                                         </button>
                                     </div>
                                 )}
                             </div>
                         </div>
                     )}
                 </div>
             </div>
        </div>
    )}

    <div className="orders-container w-full pt-4 pb-16 lg:pt-32 lg:pb-16">
      <div className="cart-details-container w-full" style={{ maxWidth: '1280px', margin: '10px auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-5">
              <h1 style={{ fontFamily: 'Gyrotrope', fontSize: '20px', fontWeight: 700, color: '#000000', marginBottom: '0', letterSpacing: '-0.01em' }}>
                Cart Items ({cartItems.length})
              </h1>
            </div>

            <div className="space-y-3" style={{ maxHeight: '750px', overflowY: 'auto', paddingRight: '5px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`.space-y-3::-webkit-scrollbar { display: none; }`}</style>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500" style={{ fontFamily: 'Gyrotrope', padding: '10px', marginTop: '10px' }}>Your cart is empty</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              deliveryAddress={deliveryAddress}
              couponCode={couponCode}
              onCouponChange={(e) => setCouponCode(e.target.value)}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={removeCoupon}
              appliedCoupon={appliedCoupon}
              totals={totals}
              onOrderNow={handlePlaceOrder}
              onAddNewAddress={() => { setModalMode('add'); setShowAddressModal(true); }}
              onChangeAddress={() => { setModalMode('select'); setShowAddressModal(true); }}
              isPlacingOrder={isPlacingOrder}
              cartItems={cartItems}
            />
          </div>
        </div>
      
        <SuggestedItemsSection title="Suggested Items" items={suggestedItems} className="w-full" 
            titleStyle={{ fontSize: '22px', marginBottom: '1rem', textDecorationThickness: '2px', textDecorationColor: '#111827', lineHeight: '1.2' }}
            containerStyle={{ paddingTop: '1rem' }}
        />
      </div>
    </div>
    </div>
  );
};

export default CartDetails;
