import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminTable from '../../components/ui/AdminTable';
import { orderService } from '../../api/orderService';

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const statuses = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrders({ status: activeStatus, search: searchQuery });
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatus, searchQuery]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700';
      case 'Processing': 
      case 'In Process':
      case 'Confirmed':
      case 'Order Placed':
        return 'bg-blue-100 text-blue-700';
      case 'Shipped':
      case 'On the Way':
      case 'Out For Delivery':
      case 'Waiting For Pick Up':
        return 'bg-orange-100 text-orange-700';
      case 'Cancelled':
      case 'Returned': 
        return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track customer orders</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
        {/* Status Tabs */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeStatus === status 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID or Customer..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
           <div className="p-12 text-center text-slate-500">Loading orders...</div>
        ) : (
           <AdminTable headers={['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Actions']}>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                    <td className="px-6 py-4 font-medium text-slate-800">#{order.id}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800 font-medium">{order.customer}</div>
                      <div className="text-slate-400 text-xs">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{order.items} items</td>
                    <td className="px-6 py-4 font-bold text-slate-800">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded bg-slate-100 ${order.payment === 'Paid' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600'}`}>
                        {order.payment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                         Details <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                     No orders found.
                   </td>
                </tr>
              )}
           </AdminTable>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
