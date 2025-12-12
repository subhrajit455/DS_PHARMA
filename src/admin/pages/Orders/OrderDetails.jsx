import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, CreditCard, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/Table';
import { orderService } from '../../api/orderService';

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

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading details...</div>;
  if (!order) return null;

  return (
    <div className="space-y-6 min-h-screen" style={{ padding: '10px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
      <Button variant="ghost" className="pl-0 text-gray-500 hover:text-gray-900" onClick={() => navigate('/admin/orders')} style={{ marginBottom: '10px' }}>
         <ArrowLeft className="mr-2 h-4 w-4" />
         <span style={{ marginTop: '5px', paddingLeft: '5px' }}>Back to Orders</span>
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-gray-900">Order #{order.id}</h1>
           <p className="text-gray-500 text-sm mt-1">{order.date} • {order.items?.length || 0} Items</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-2">
           <span className="text-lg font-bold text-gray-900 pl-2" style={{ marginTop: '2px', padding: '10px 0px' }}>Status:</span>
           <select 
             className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md focus:ring-emerald-500 focus:border-emerald-500 block p-2 outline-none"
             value={order.status}
             onChange={(e) => handleStatusChange(e.target.value)}
             disabled={isUpdating}
             style={{ padding: '8px 0px' }}
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
           <Card>
              <CardHeader>
                  <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                        <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                            <TableHead className="pl-6 font-semibold text-gray-700" style={{ padding: '12px 16px', paddingLeft: '24px' }}>Product</TableHead>
                            <TableHead className="font-semibold text-gray-700" style={{ padding: '12px 16px' }}>Price</TableHead>
                            <TableHead className="font-semibold text-gray-700" style={{ padding: '12px 16px' }}>Quantity</TableHead>
                            <TableHead className="text-right pr-6 font-semibold text-gray-700" style={{ padding: '12px 16px', paddingRight: '24px' }}>Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {order.products.map((item, idx) => (
                           <TableRow 
                             key={idx}
                             className="hover:bg-emerald-50/50 transition-all duration-200 border-b border-gray-100"
                             style={{ 
                               marginBottom: idx !== order.products.length - 1 ? '5px' : '0',
                             }}
                           >
                             <TableCell className="pl-6 font-medium text-gray-900" style={{ padding: '10px', paddingLeft: '16px' }}>{item.name}</TableCell>
                             <TableCell style={{ padding: '10px' }}>₹{item.price}</TableCell>
                             <TableCell style={{ padding: '10px' }}>{item.qty}</TableCell>
                             <TableCell className="text-right pr-6 font-medium text-gray-900" style={{ padding: '10px', paddingRight: '16px' }}>₹{item.price * item.qty}</TableCell>
                           </TableRow>
                         ))}
                         <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                           <TableCell colSpan={3} className="pl-6 text-right font-medium text-gray-500" style={{ padding: '10px', paddingLeft: '16px' }}>Subtotal</TableCell>
                           <TableCell className="text-right pr-6 font-medium text-gray-900" style={{ padding: '10px', paddingRight: '16px' }}>₹{order.total}</TableCell>
                         </TableRow>
                         <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableCell colSpan={3} className="pl-6 text-right font-medium text-gray-500" style={{ padding: '10px', paddingLeft: '16px' }}>Shipping</TableCell>
                            <TableCell className="text-right pr-6 font-medium text-gray-900" style={{ padding: '10px', paddingRight: '16px' }}>Free</TableCell>
                         </TableRow>
                         <TableRow className="bg-gray-100/50 hover:bg-gray-100/50">
                            <TableCell colSpan={3} className="pl-6 text-right font-bold text-lg text-gray-900" style={{ padding: '10px', paddingLeft: '16px' }}>Grand Total</TableCell>
                            <TableCell className="text-right pr-6 font-bold text-lg text-emerald-600" style={{ padding: '10px', paddingRight: '16px' }}>₹{order.total}</TableCell>
                         </TableRow>
                    </TableBody>
                  </Table>
              </CardContent>
           </Card>
        </div>

        {/* Right Column: Customer & Address */}
        <div className="space-y-6">
           <Card style={{ marginBottom: '10px', padding: '10px' }}>
              <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex items-start gap-4">
                    <Avatar 
                        className="bg-blue-100 text-blue-600"
                        fallback={<User className="h-4 w-4" />} 
                    />
                    <div>
                        <h4 className="font-semibold text-gray-900">{order.customer || 'Guest User'}</h4>
                        <p className="text-sm text-gray-500 mt-0.5">{order.email}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{order.phone || '+91 9999999999'}</p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card style={{ marginBottom: '10px', padding: '10px' }}>
               <CardHeader>
                   <CardTitle>Delivery Address</CardTitle>
               </CardHeader>
               <CardContent>
                   <div className="flex items-start gap-4">
                     <MapPin className="mt-1 h-5 w-5 text-gray-400 shrink-0" />
                     <p className="text-sm text-gray-600 leading-relaxed">
                        {order.shippingAddress}
                     </p>
                   </div>
                   
                   <div className="mt-6 pt-4 border-t border-gray-100">
                       <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Truck className="h-4 w-4" /> Shipping Method
                       </h4>
                       <p className="text-sm text-gray-600">{order.courierName ? `${order.courierName} Express` : 'Standard Delivery (3-5 Days)'}</p>
                   </div>
               </CardContent>
           </Card>

           <Card style={{ marginBottom: '10px', padding: '10px' }}>
               <CardHeader>
                   <CardTitle>Payment Information</CardTitle>
               </CardHeader>
               <CardContent>
                   <div className="flex items-start gap-4">
                      <CreditCard className="mt-1 h-5 w-5 text-gray-400" />
                      <div>
                         <p className="text-sm font-medium text-gray-900">Paid Online</p>
                         <p className="text-[8px] sm:text-xs text-gray-500 mt-1">Status: {order.payment || 'Completed'}</p>
                      </div>
                   </div>
               </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
