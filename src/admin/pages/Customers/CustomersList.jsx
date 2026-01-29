import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mail, Phone, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import toastUtil from '@/shared/utils/toast';
import { Button } from '@/admin/components/ui/Button';
import { Input } from '@/admin/components/ui/Input';
import { Badge } from '@/admin/components/ui/Badge';
import { Card, CardContent } from '@/admin/components/ui/Card';
import { Avatar } from '@/admin/components/ui/Avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/admin/components/ui/Table';
import { customerService } from '@/services/admin/api/customerService';
import { Pagination } from '@/admin/components/ui/Pagination';
import Loading from '@/shared/components/common/Loading';

const CustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCustomers = React.useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await customerService.getCustomers({ search: searchQuery });
      const customerArray = Array.isArray(data) ? data : (data?.data || []);
      
      const sanitizedCustomers = customerArray.map((customer) => ({
        id: customer?.id || `temp-${Date.now()}`,
        name: customer?.name || 'Unknown Customer',
        email: customer?.email || 'N/A',
        phone: customer?.phone || 'N/A',
        joined: customer?.joined || 'N/A',
        orders: customer?.orders || 0,
        totalSpent: customer?.totalSpent || 0,
        status: customer?.status || 'Inactive',
      }));
      
      setCustomers(sanitizedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setHasError(true);
      setCustomers([]);
      toastUtil.error('Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (hasError) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Failed to Load Customers</h3>
        <Button onClick={fetchCustomers} className="mt-4">Try Again</Button>
      </div>
    );
  }

  if (isLoading && customers.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loading size="large" text="Loading customers..." />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 p-4" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent flex items-center gap-2">
            Customers
            <Sparkles className="h-8 w-8 text-emerald-500" />
          </h2>
          <p className="text-gray-500 text-sm">Manage your customer base</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col shadow-sm bg-white/50 backdrop-blur-xl">
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="mb-4">
            <div className="relative w-full lg:w-72">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search customers..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                  <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                  <TableHead className="font-semibold text-gray-700 hidden md:table-cell">Contact</TableHead>
                  <TableHead className="font-semibold text-gray-700 hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Orders</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Spent</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-emerald-50/50 cursor-pointer" onClick={() => navigate(`/admin/customers/${customer.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-emerald-100 text-emerald-800" fallback={getInitials(customer.name)} />
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-xs text-gray-500 flex flex-col">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {customer.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {customer.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-500">{customer.joined}</TableCell>
                    <TableCell className="text-center font-medium">{customer.orders}</TableCell>
                    <TableCell className="font-bold">₹{customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === 'Active' ? 'success' : 'secondary'}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/admin/customers/${customer.id}`); }}>
                        Details <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(customers.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersList;
