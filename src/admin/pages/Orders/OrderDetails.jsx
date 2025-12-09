import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminCard from '../../components/ui/AdminCard';
import AdminTable from '../../components/ui/AdminTable';
import { orderService } from '../../api/orderService';
import { useQueryClient } from '@tanstack/react-query';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = ['Order Placed', 'Confirmed', 'In Process', 'Waiting For Pick Up', 'On the Way', 'Out For Delivery', 'Delivered', 'Returned', 'Cancelled'];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(id);
        setOrder(data);
      } catch (error) {
        console.error(error);
        toast.error('Order not found');
        navigate('/admin/orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  /* Removed invalid lines */

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await orderService.updateOrderStatus(id, newStatus);
      setOrder(prev => ({ ...prev, status: newStatus }));
      
      // Invalidate orders list
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast.success(`Order updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
  if (!order) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate('/admin/orders')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Back to Orders</span>
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Order #{order.id}</h1>
           <p className="text-slate-500 text-sm mt-1">{order.date} • {order.items?.length || 0} Items</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200">
           <span className="text-sm font-medium text-slate-600 pl-2">Status:</span>
           <select 
             className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none"
             value={order.status}
             onChange={(e) => handleStatusChange(e.target.value)}
             disabled={isUpdating}
           >
             {statusOptions.map(status => (
               <option key={status} value={status}>{status}</option>
             ))}
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
           <AdminCard title="Order Items">
              <AdminTable headers={['Product', 'Price', 'Quantity', 'Total']}>
                 {order.products.map((item, idx) => (
                   <tr key={idx} className="border-b border-slate-50 last:border-none">
                     <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                     <td className="px-6 py-4 text-slate-600">₹{item.price}</td>
                     <td className="px-6 py-4 text-slate-600">{item.qty}</td>
                     <td className="px-6 py-4 font-medium text-slate-800">₹{item.price * item.qty}</td>
                   </tr>
                 ))}
                 <tr className="bg-slate-50">
                   <td colSpan="3" className="px-6 py-3 text-right font-semibold text-slate-600">Subtotal</td>
                   <td className="px-6 py-3 font-semibold text-slate-800">₹{order.total}</td>
                 </tr>
                 <tr className="bg-slate-50">
                    <td colSpan="3" className="px-6 py-3 text-right font-semibold text-slate-600">Shipping</td>
                    <td className="px-6 py-3 font-semibold text-slate-800">Free</td>
                 </tr>
                 <tr className="bg-slate-100/50">
                    <td colSpan="3" className="px-6 py-4 text-right font-bold text-lg text-slate-800">Grand Total</td>
                    <td className="px-6 py-4 font-bold text-lg text-emerald-600">₹{order.total}</td>
                 </tr>
              </AdminTable>
           </AdminCard>
        </div>

        {/* Right Column: Customer & Address */}
        <div className="space-y-6">
           <AdminCard title="Customer Details">
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={20} />
                 </div>
                 <div>
                    <h4 className="font-semibold text-slate-800">{order.customer || 'Guest User'}</h4>
                    <p className="text-sm text-slate-500 mt-0.5">{order.email}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{order.phone || '+91 9999999999'}</p>
                 </div>
              </div>
           </AdminCard>

           <AdminCard title="Delivery Address">
               <div className="flex items-start gap-4">
                 <div className="mt-1 text-slate-400">
                    <MapPin size={20} />
                 </div>
                 <p className="text-sm text-slate-600 leading-relaxed">
                    {order.shippingAddress}
                 </p>
               </div>
               
               <div className="mt-6 pt-4 border-t border-slate-100">
                   <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Truck size={16} /> Shipping Method
                   </h4>
                   <p className="text-sm text-slate-600">{order.courierName ? `${order.courierName} Express` : 'Standard Delivery (3-5 Days)'}</p>
               </div>
           </AdminCard>

           <AdminCard title="Payment Information">
               <div className="flex items-start gap-4">
                  <div className="mt-1 text-slate-400">
                     <CreditCard size={20} />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-slate-800">Paid Online</p>
                     <p className="text-xs text-slate-500 mt-1">Status: {order.payment || 'Completed'}</p>
                  </div>
               </div>
           </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
