import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/Table';
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

  const getStatusVariant = (status) => {
    const s = status?.toLowerCase() || '';
    if (['delivered', 'completed'].includes(s)) return 'success'; // Green
    if (['cancelled', 'returned', 'failed'].includes(s)) return 'destructive'; // Red
    if (['shipped', 'on the way', 'out for delivery', 'waiting for pick up'].includes(s)) return 'warning'; // Yellow
    return 'secondary'; // Gray (Processing, Placed, etc)
  };

  return (
    <div className="space-y-6 min-h-screen" style={{ padding: '10px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
           <p className="text-gray-500 text-sm mt-1">Manage and track customer orders</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center" style={{ marginBottom: '10px' }}>
                {/* Status Tabs */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg overflow-x-auto max-w-full no-scrollbar" style={{ marginBottom: '10px' }}>
                {statuses.map(status => (
                    <button
                        style={{ padding: '4px 10px', margin: '0px 10px' }}
                        key={status}
                        onClick={() => setActiveStatus(status)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                            activeStatus === status 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        {status}
                    </button>
                    /* Note: Could use Button variants here, but custom toggle styling is often cleaner for tabs */
                ))}
                </div>

                {/* Search */}
                <div className="relative w-full lg:w-72">
                    <Search className="absolute right-2.5 top-2 h-4 w-4 text-gray-500" />
                    <Input 
                        placeholder="Search Order..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-gray-200" style={{ padding: '0px 10px' }}>
                 <Table>
                    <TableHeader>
                        <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                            <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Order ID</TableHead>
                            <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Date</TableHead>
                            <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Customer</TableHead>
                            <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Items</TableHead>
                            <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Total</TableHead>
                            <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Payment</TableHead>
                            <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Status</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">Loading orders...</TableCell>
                            </TableRow>
                        ) : orders.length > 0 ? (
                            orders.map((order, index) => (
                                <TableRow 
                                    key={order.id} 
                                    className="hover:bg-emerald-50/50 cursor-pointer transition-all duration-200 border-b border-gray-100" 
                                    style={{ 
                                        marginBottom: index !== orders.length - 1 ? '5px' : '0',
                                    }}
                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                >
                                    <TableCell className="font-medium" style={{ padding: '10px' }}>#{order.id}</TableCell>
                                    <TableCell className="text-gray-500 text-sm" style={{ padding: '10px' }}>{order.date}</TableCell>
                                    <TableCell style={{ padding: '10px' }}>
                                        <div className="font-medium text-gray-900">{order.customer || order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.email}</div>
                                    </TableCell>
                                    <TableCell className="text-gray-500" style={{ padding: '10px' }}>{order.items} items</TableCell>
                                    <TableCell className="font-bold" style={{ padding: '10px' }}>₹{order.total || order.paymentBreakdown?.total}</TableCell>
                                    <TableCell style={{ padding: '10px' }}>
                                        <Badge variant={order.payment === 'Paid' ? 'success' : 'secondary'} className="font-normal">
                                            {order.payment}
                                        </Badge>
                                    </TableCell>
                                    <TableCell style={{ padding: '10px' }}>
                                        <Badge variant={getStatusVariant(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right" style={{ padding: '10px' }}>
                                         <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/orders/${order.id}`); }}>
                                            Details <ArrowRight className="ml-2 h-4 w-4" />
                                         </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-gray-500">No orders found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                 </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersList;
