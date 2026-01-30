import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/admin/components/ui/Button';
import Loading from '@/shared/components/common/Loading';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/shared/hooks/queries/useCartQuery';

const CartDetails = () => {
    const navigate = useNavigate();
    const { data: cartData, isLoading, isError } = useCart();
    const updateMutation = useUpdateCartItem();
    const removeMutation = useRemoveCartItem();

    // Robust Data Mapping: Handle various response structures
    const cartItems = useMemo(() => {
        if (!cartData) return [];
        if (Array.isArray(cartData)) return cartData;
        return cartData.data || cartData.cartItems || cartData.items || [];
    }, [cartData]);

    // Calculate totals
    const { totalQuantity, totalAmount, subtotal, discount } = useMemo(() => {
        if (!cartItems.length) return { totalQuantity: 0, totalAmount: 0, subtotal: 0, discount: 0 };

        const sub = cartItems.reduce((acc, item) => acc + (item.productId?.price || 0) * item.quantity, 0);
        const total = cartItems.reduce((acc, item) => acc + (item.productId?.discountedPrice || item.productId?.price || 0) * item.quantity, 0);
        
        return {
            totalQuantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
            totalAmount: total,
            subtotal: sub,
            discount: sub - total
        };
    }, [cartItems]);

    const handleQuantityChange = (itemId, type, currentQty) => {
        if (type === 'increase') {
            updateMutation.mutate({ id: itemId, quantity: currentQty + 1 });
        } else {
            if (currentQty > 1) {
                updateMutation.mutate({ id: itemId, quantity: currentQty - 1 });
            }
        }
    };

    const handleRemoveItem = (itemId) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            removeMutation.mutate(itemId);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <Loading size="large" text="Loading cart..." />
            </div>
        );
    }

    // DEBUG: Temporary visual aid
    if (cartData) {
        console.log("[Cart UI] Raw Data:", cartData);
    }

    if (isError) {
       return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
                <p className="text-red-500 font-medium">Failed to load cart. Please try again.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
       );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Button 
                        onClick={() => navigate('/products')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/20"
                    >
                        Start Shopping
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
            {/* DEBUG AID: Remove after fixing */}
            <div className="bg-black text-green-400 p-4 mb-4 rounded overflow-auto max-h-60 text-xs font-mono">
                <strong>DEBUG: Cart Data Structure</strong>
                <pre>{JSON.stringify(cartData, null, 2)}</pre>
            </div>

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    Shopping Cart
                    <span className="text-sm font-medium bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                        {totalQuantity} Items
                    </span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-4">
                        {cartItems.map((item) => (
                            <div 
                                key={item._id} 
                                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                            >
                                <div className="flex gap-4 sm:gap-6">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                        <img 
                                            src={item.productId?.image?.[0]?.url || item.productId?.image || '/placeholder-image.png'} 
                                            alt={item.productId?.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2 hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => navigate(`/product/${item.productId?._id}`)}>
                                                        {item.productId?.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">{item.productId?.brand}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                    disabled={removeMutation.isPending}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="font-bold text-lg text-emerald-700">
                                                    ₹{item.productId?.discountedPrice || item.productId?.price}
                                                </span>
                                                {item.productId?.discountedPrice && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ₹{item.productId?.price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quantity & Total */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                                <button 
                                                    onClick={() => handleQuantityChange(item._id, 'decrease', item.quantity)}
                                                    className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 disabled:opacity-50 transition-all"
                                                    disabled={item.quantity <= 1 || updateMutation.isPending}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="font-semibold w-8 text-center text-gray-900">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleQuantityChange(item._id, 'increase', item.quantity)}
                                                    className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 disabled:opacity-50 transition-all"
                                                    disabled={updateMutation.isPending}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 mb-0.5">Subtotal</p>
                                                <p className="font-bold text-gray-900">
                                                    ₹{((item.productId?.discountedPrice || item.productId?.price) * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-emerald-600">
                                    <span>Discount</span>
                                    <span>-₹{discount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charges</span>
                                    <span className="text-emerald-600 font-medium">Free</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4" />
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-emerald-700">₹{totalAmount.toFixed(2)}</span>
                                        <p className="text-xs text-gray-500 mt-1">Include all taxes</p>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg font-semibold rounded-xl shadow-lg shadow-emerald-600/20 group"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                    Secure Payment
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Truck className="h-4 w-4 text-emerald-600" />
                                    Free Delivery
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartDetails;
