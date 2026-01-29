import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, ArrowRight, Sparkles } from 'lucide-react';
import toastUtil from '@/shared/utils/toast';
import { Button } from '@/admin/components/ui/Button';
import { Input } from '@/admin/components/ui/Input';
import { Badge } from '@/admin/components/ui/Badge';
import { Card, CardContent } from '@/admin/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/admin/components/ui/Table';
import { orderService } from '@/services/admin/api/orderService';
import { Pagination } from '@/admin/components/ui/Pagination';
import Loading from '@/shared/components/common/Loading';

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const statuses = ['All', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED'];

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrders({ status: activeStatus, search: searchQuery });
      setOrders(data);
    } catch (error) {
      console.error(error);
      toastUtil.error('Failed to fetch orders');
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
    const s = status?.toUpperCase() || '';
    if (['DELIVERED', 'RETURN_COMPLETED'].includes(s)) return 'success'; // Green
    if (['CANCELLED', 'FAILED'].includes(s)) return 'destructive'; // Red
    if (['SHIPPED', 'RETURN_REQUESTED'].includes(s)) return 'warning'; // Yellow
    if (['CONFIRMED', 'RETURN_APPROVED'].includes(s)) return 'primary'; // Blue (using primary as a proxy for info/blue)
    return 'secondary'; // Gray (PLACED, etc)
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loading size="large" text="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 p-2 sm:p-4 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)',padding: '0px 1rem' }}>
    <div style={{ padding: '10px 10px'}}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 shrink-0">
        <div>
          <div>
           <h2 className="text-xl sm:text-2xl md:text-4xl font-bold bg-linear-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent flex items-center gap-2">
             Orders
             <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-emerald-500" />
           </h2>
           <p className="text-gray-500 text-[10px] sm:text-[8px] sm:text-xs md:text-sm mt-0.5">Manage and track customer orders</p>
          </div>
        </div>
      </div>

      <Card className="flex-1 flex flex-col min-h-[calc(100vh-190px)] shadow-sm border-gray-200/60 bg-white/50 backdrop-blur-xl">
        <CardContent className="flex-1 flex flex-col p-2 sm:p-3 md:p-4 min-h-0">
            <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4 justify-between items-center mb-2 sm:mb-3 md:mb-4 shrink-0" style={{ paddingBottom: '5px' }}>
                {/* Status Tabs */}
                <div className="flex gap-1 sm:gap-2 p-1 bg-gray-100 rounded-lg overflow-x-auto max-w-full no-scrollbar scrollbar-hide">
                {statuses.map(status => (
                    <button
                        style={{padding:'2px 5px'}}
                        key={status}
                        onClick={() => setActiveStatus(status)}
                        className={`px-2 sm:px-3 py-1.5 text-[7px] sm:text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                            activeStatus === status 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        {status}
                    </button>
                ))}
                </div>

                {/* Search */}
                <div className="relative w-full lg:w-72">
                    <Search className="absolute right-2.5 top-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    <Input 
                        placeholder="Search Order..." 
                        className="pl-8 sm:pl-9 text-[8px] sm:text-sm h-9 sm:h-10"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-auto rounded-md border border-gray-200">
                 <Table>
                    <TableHeader>
                        <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                            <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '6px' }}>Order ID</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden md:table-cell" style={{ padding: '6px' }}>Date</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden sm:table-cell" style={{ padding: '6px' }}>Customer</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden lg:table-cell" style={{ padding: '6px ' }}>Items</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '6px' }}>Total</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden xl:table-cell" style={{ padding: '6px' }}>Payment</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '6px' }}>Status</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '6px' }}>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">Loading orders...</TableCell>
                            </TableRow>
                        ) : orders.length > 0 ? (
                            orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order) => (
                                <TableRow 
                                    key={order.id} 
                                    className="hover:bg-emerald-50/50 cursor-pointer transition-all duration-200 border-b border-gray-100"
                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                >
                                    <TableCell className="font-medium text-[8px] sm:text-xs" style={{ padding: '6px 5px' }}>#{order.id}</TableCell>
                                    <TableCell className="text-gray-500 text-[8px] sm:text-xs hidden md:table-cell" style={{ padding: '6px 5px' }}>{order.date}</TableCell>
                                    <TableCell className="hidden sm:table-cell" style={{ padding: '6px 5px' }}>
                                        <div className="font-medium text-gray-900 text-[8px] sm:text-xs">{order.customer || order.customerName}</div>
                                        <div className="text-[8px] sm:text-xs text-gray-500">{order.email}</div>
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-[8px] sm:text-xs hidden lg:table-cell" style={{ padding: '6px 5px' }}>{order.items} items</TableCell>
                                    <TableCell className="font-bold text-[8px] sm:text-xs text-center" style={{ padding: '6px 5px' }}>₹{order.total || order.paymentBreakdown?.total}</TableCell>
                                    <TableCell className="hidden xl:table-cell" style={{ padding: '6px 5px 6px 10px' }}>
                                        <Badge variant={order.payment === 'Paid' ? 'success' : 'secondary'} className=" font-normal text-[8px] sm:text-xs">
                                            {order.payment}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="" style={{ padding: '6px 0px' }}>
                                        <Badge variant={getStatusVariant(order.status)} className="text-[8px] sm:text-xs">
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center" style={{ padding: '6px 5px' }}>
                                         <Button variant="ghost" size="sm" className="text-[8px] sm:text-xs h-7 sm:h-8" onClick={(e) => { e.stopPropagation(); navigate(`/admin/orders/${order.id}`); }}> 
                                            <span className="hidden sm:inline" style={{marginTop:'3px', paddingRight:'3px'}}>Details</span>
                                            <Eye className="text-center h-3 w-3 sm:h-4 sm:w-4 sm:ml-2" />
                                         </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-[8px] sm:text-xs text-gray-500">No orders found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                 </Table>
            </div>
            
        </CardContent>
       
      </Card>
       {!isLoading && orders.length > 0 && (
              <div className="shrink-0 mt-4 pt-4 bottom-0" style={{ marginTop:'0px'}}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(orders.length / itemsPerPage)}
                  onPageChange={page => setCurrentPage(page)}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={(val) => {
                      setItemsPerPage(val);
                      setCurrentPage(1);
                  }}
                />
              </div>
            )}
    </div>
    </div>
  );
};

export default OrdersList;
