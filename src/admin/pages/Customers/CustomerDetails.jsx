import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/Table';
import { customerService } from '../../api/customerService';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomer(id);
        setCustomer(data);
      } catch (error) {
        console.error(error);
        toast.error('Customer not found');
        navigate('/admin/customers');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomer();
  }, [id, navigate]);

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading details...</div>;
  if (!customer) return null;

  return (
    <div className="space-y-6 min-h-screen" style={{ padding: '10px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
       <Button variant="ghost" className="pl-0 text-gray-500 hover:text-gray-900 mb-2 sm:mb-3 md:mb-4 text-[10px] sm:text-[8px] sm:text-xs md:text-sm" onClick={() => navigate('/admin/customers')}>
         <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
         <span style={{marginTop: '3px'}}>Back to Customers</span>
      </Button>

      {/* Header Profile */}
      <Card style={{ padding: '10px', marginBottom: '10px' }}>
          <CardContent className="p-3 sm:p-6 flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 text-gray-500 text-xl sm:text-2xl font-bold" fallback={customer.name.substring(0, 2).toUpperCase()} />
            
            <div className="flex-1 text-center md:text-left space-y-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{customer.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4 text-[8px] sm:text-sm text-gray-500">
                    <span className="flex items-center gap-1 sm:gap-1.5"><Mail className="h-3 w-3 sm:h-4 sm:w-4" /> {customer.email}</span>
                    <span className="flex items-center gap-1 sm:gap-1.5"><Phone className="h-3 w-3 sm:h-4 sm:w-4" /> {customer.phone}</span>
                    <span className="flex items-center gap-1 sm:gap-1.5"><Calendar className="h-3 w-3 sm:h-4 sm:w-4" /> Joined {customer.joined}</span>
                </div>
                <div className="pt-2">
                    <Badge variant={customer.status === 'Active' ? 'success' : 'secondary'} className="text-[8px] sm:text-xs">
                        {customer.status}
                    </Badge>
                </div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-6 sm:gap-8 md:border-l border-gray-100 md:pl-6 lg:pl-8 pt-4 md:pt-0">
                <div className="text-center">
                    <p className="text-[8px] sm:text-sm text-gray-500 mb-1">Total Orders</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{customer.orders}</p>
                </div>
                <div className="text-center">
                    <p className="text-[8px] sm:text-sm text-gray-500 mb-1">Total Spent</p>
                    <p className="text-lg sm:text-xl font-bold text-emerald-600">₹{customer.totalSpent}</p>
                </div>
            </div>
          </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Orders */}
        <div className="lg:col-span-2">
           <Card>
              <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl">Order History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                        <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                            <TableHead className="pl-6 font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '12px 16px', paddingLeft: '24px' }}>Order ID</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden sm:table-cell" style={{ padding: '12px 16px' }}>Date</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '12px 16px' }}>Total</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden md:table-cell" style={{ padding: '12px 16px' }}>Status</TableHead>
                            <TableHead className="text-right pr-6 font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '12px 16px', paddingRight: '24px' }}>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customer.recentOrders.map((order, index) => (
                            <TableRow 
                                key={order.id} 
                                className="hover:bg-emerald-50/50 transition-all duration-200 border-b border-gray-100"
                            >
                                <TableCell className="pl-6 font-medium text-gray-900 text-[8px] sm:text-sm" style={{ padding: '10px', paddingLeft: '14px' }}>{order.id}</TableCell>
                                <TableCell className="text-gray-500 text-[8px] sm:text-sm hidden sm:table-cell" style={{ padding: '10px' }}>{order.date}</TableCell>
                                <TableCell className="font-bold text-gray-900 text-[8px] sm:text-sm" style={{ padding: '10px' }}>₹{order.total}</TableCell>
                                <TableCell className="hidden md:table-cell" style={{ padding: '10px' }}>
                                    <Badge variant={['Delivered'].includes(order.status) ? 'success' : 'secondary'} className="text-[8px] sm:text-xs">
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="pl-6 text-right pr-6 text-[8px] sm:text-sm" style={{ padding: '10px', paddingRight: '14px' }}>
                                    <Button variant="link" size="sm" onClick={() => navigate(`/admin/orders/${order.id.replace('#', '')}`)}>                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {customer.recentOrders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">No recent orders.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                  </Table>
              </CardContent>
           </Card>
        </div>

        {/* Right Column: Address & Notes */}
        <div className="space-y-4 sm:space-y-6">
           <Card style={{ padding: '10px', marginBottom: '10px' }}>
              <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl">Default Address</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex items-start gap-3 sm:gap-4">
                     <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" />
                     <p className="text-[8px] sm:text-sm text-gray-600 leading-relaxed">{customer.address}</p>
                  </div>
              </CardContent>
           </Card>
           
           <Card>
              <CardHeader className="pb-2 sm:pb-3 md:pb-4">
                  <CardTitle className="text-base sm:text-lg md:text-xl">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 border border-gray-100 rounded-lg">
                     <div className="p-1.5 sm:p-2 bg-gray-50 rounded"><CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" /></div>
                     <div>
                        <p className="text-[8px] sm:text-sm font-medium text-gray-900">Visa ending in 4242</p>
                        <p className="text-[8px] sm:text-xs text-gray-500">Expires 12/25</p>
                     </div>
                  </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
