import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Loader } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { useOrderDetails } from '@/hooks/queries/useOrderDetails';
import Button from '@/components/ui/Button';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    
    // Fetch data from real service (mock or API) instead of local store
    const { data: order, isLoading, isError } = useOrderDetails(orderId);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                   <Loader className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
                   <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
                    <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
                    <Button
                        onClick={() => navigate('/')}
                        className="bg-emerald-600! hover:bg-emerald-700!"
                        style={{ padding: '5px 12px', margin: '10px auto' }}
                    >
                        Go Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 relative" style={{ padding: '10px' }}>
            <Button 
                variant="ghost" 
                onClick={() => navigate('/')} 
                className="absolute top-4 left-4 text-gray-600 hover:text-emerald-600 flex items-center gap-2"
            >
                <ArrowRight className="w-4 h-4 rotate-180" /> <span style={{ marginTop: '3px' }}>Back to Home</span>
            </Button>
            <div className="max-w-4xl mx-auto" style={{ width: '100%', margin: '0 auto', paddingTop: '5rem' }}>
                <Motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center"
                    style={{ padding: '2rem' }}
                >
                    {/* Success Icon */}
                    <Motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        style={{ margin: '10px auto' }}
                        
                    >
                        <CheckCircle className="w-14 h-14 text-emerald-600"  />
                    </Motion.div>

                    {/* Title */}
                    <h1 
                        className="text-3xl font-bold text-gray-900 mb-2"
                        style={{ fontFamily: 'Gyrotrope' }}
                    >
                        Order Placed Successfully!
                    </h1>
                    <p className="text-gray-500 mb-8" style={{ fontFamily: 'Gyrotrope', marginBottom: '1rem' }}>
                        Thank you for your order. We'll send you a confirmation email shortly.
                    </p>

                    {/* Order Details Card */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
                        <div className="flex items-center gap-1 mb-4" style={{ marginBottom: '10px' }}>
                            <Package className="w-5 h-5 text-emerald-600" />
                            <span className="font-semibold text-gray-900" style={{ fontFamily: 'Gyrotrope', marginTop:'5px' }}>
                                Order Details
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Order ID</span>
                                <span className="font-semibold text-gray-900 text-sm">{order.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Items</span>
                                <span className="font-semibold text-gray-900 text-sm">{order.items?.length || 0} items</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Payment Method</span>
                                <span className="font-semibold text-gray-900 text-sm capitalize">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Expected Delivery</span>
                                <span className="font-semibold text-emerald-600 text-sm">{order.expectedDelivery}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 mt-3">
                                <div className="flex justify-between" style={{ margin: '5px 0px 10px 0px' }}>
                                    <span className="font-semibold text-gray-900">Total Amount</span>
                                    <span className="font-bold text-emerald-600 text-lg">₹{order.totals?.total || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={() => navigate('/orders')}
                            size="full"
                            className="bg-emerald-600! hover:bg-emerald-700! rounded-xl! py-2.5!"
                        >
                            View My Orders
                            <ArrowRight className="w-4 h-4 ml-2 inline" />
                        </Button>
                        <Button
                            onClick={() => navigate('/')}
                            variant="outline"
                            size="full"
                            className="rounded-xl! py-2.5!"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </Motion.div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-lg p-6 mt-6"
                        style={{ margin: '20px auto', padding: '1rem 2rem' }}
                    >
                        <h3 className="font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Gyrotrope' }}>
                            Delivering To
                        </h3>
                        <div className="text-sm text-gray-600" style={{ fontFamily: 'Gyrotrope' }}>
                            <p className="font-semibold text-gray-900">{order.deliveryAddress.name}</p>
                            <p>{order.deliveryAddress.address}</p>
                            <p>Phone: {order.deliveryAddress.phone}</p>
                        </div>
                    </Motion.div>
                )}
            </div>
        </div>
    );
};

export default OrderConfirmation;
