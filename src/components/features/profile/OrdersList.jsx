import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/hooks/queries/useOrders';

const OrdersList = () => {
    const navigate = useNavigate();
    
    // Fetch orders using React Query
    const { data: ordersData, isLoading } = useOrders();

    // Mock data as fallback
    const mockOrders = [
        { id: 1001, date: 'Nov 28, 2024', items: 5, total: 1250, status: 'Delivered', statusColor: 'green' },
        { id: 1002, date: 'Nov 25, 2024', items: 3, total: 890, status: 'In Transit', statusColor: 'blue' },
        { id: 1003, date: 'Nov 20, 2024', items: 2, total: 450, status: 'Delivered', statusColor: 'green' }
    ];

    const orders = ordersData || mockOrders;

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-4 md:p-8"
        >
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: 'Gyrotrope', color: '#1F2937' }}>
                    Order History
                </h2>
                <button 
                    onClick={() => navigate('/orders')}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                >
                    View All
                    <span>→</span>
                </button>
            </div>
            <div className="space-y-4">
                {orders.map((order) => (
                    <Motion.div
                        key={order.id}
                        whileHover={{ scale: 1.01, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                        className="border border-gray-200 rounded-xl p-5 transition-all cursor-pointer bg-gradient-to-r from-white to-gray-50"
                        onClick={() => navigate(`/orders/${order.id}`)}
                    >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Package className="w-5 h-5 text-teal-600" />
                                    <p className="font-bold text-base md:text-lg" style={{ fontFamily: 'Gyrotrope' }}>
                                        Order #{order.id}
                                    </p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.statusColor === 'green' || order.status === 'Delivered'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 ml-8">
                                    <span className="flex items-center gap-1">
                                        📅 {order.date || order.expectedDelivery}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        📦 {order.items || 1} items
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold text-gray-800">
                                        💰 ₹{(order.total || order.price || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 ml-8 md:ml-0">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Track order logic
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                                >
                                    Track Order
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/orders/${order.id}`);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-md"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>
    );
};

export default OrdersList;
