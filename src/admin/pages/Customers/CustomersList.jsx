import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mail, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/Table';
import { customerService } from '../../api/customerService';

const CustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await customerService.getCustomers({ search: searchQuery });
      
      // ✅ DEFENSIVE: Ensure data is always an array
      if (!data) {
        setCustomers([]);
        return;
      }
      
      // ✅ DEFENSIVE: If data is an object with a data property, extract it
      const customerArray = Array.isArray(data) ? data : (data.data || []);
      
      // ✅ DEFENSIVE: Validate and sanitize each customer object
      const sanitizedCustomers = customerArray.map((customer) => ({
        id: customer?.id || `temp-${Date.now()}-${Math.random()}`,
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
      setCustomers([]); // ✅ DEFENSIVE: Set to empty array on error
      toast.error('Failed to fetch customers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  /**
   * ✅ DEFENSIVE HELPER: Safely get initials from name
   * Prevents .slice() errors on undefined/null values
   */
  const getInitials = (name) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return '??';
    }
    
    const trimmedName = name.trim();
    const words = trimmedName.split(' ');
    
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    
    return trimmedName.slice(0, 2).toUpperCase();
  };

  /**
   * ✅ ERROR BOUNDARY FALLBACK UI
   */
  if (hasError) {
    return (
      <div className="space-y-6" style={{padding:'5px'}}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Customers</h2>
            <p className="text-gray-500 text-sm mt-1">Manage your customer base</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Customers</h3>
            <p className="text-gray-500 mb-4">There was an error loading the customer data.</p>
            <Button onClick={fetchCustomers}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen" style={{ padding: '5px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Customers</h2>
          <p className="text-gray-500 text-[10px] sm:text-[8px] sm:text-xs md:text-sm mt-0.5">Manage your customer base</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-2 sm:p-3 md:p-4 lg:p-6 space-y-2 sm:space-y-3 md:space-y-4">
          <div className="relative max-w-md mb-3 sm:mb-4" style={{ paddingBottom: '5px' }}>
            <Search className="absolute right-2.5 top-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
            <Input 
              placeholder="Search customers..." 
              className="pl-8 sm:pl-9 text-[8px] sm:text-sm h-9 sm:h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="rounded-md border border-gray-200 p-0 sm:p-2">
            <Table>
              <TableHeader>
                <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                  <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '8px 5px' }}>Customer</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden md:table-cell" style={{ padding: '8px 5px' }}>Contact</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden lg:table-cell" style={{ padding: '8px 5px' }}>Joined</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm " style={{ padding: '8px 5px' }}>Orders</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '8px 5px' }}>Total Spent</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '8px 5px' }}>Status</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '8px 5px' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
                        <span className="text-[8px] sm:text-sm">Loading customers...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !Array.isArray(customers) || customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500 text-[8px] sm:text-sm">
                      {searchQuery ? `No customers found matching "${searchQuery}"` : 'No customers found.'}
                    </TableCell>
                  </TableRow>
                 ) : (
                  // ✅ DEFENSIVE: Extra safety check before mapping
                  customers.map((customer) => {
                    if (!customer || !customer.id) {
                      console.warn('Invalid customer object:', customer);
                      return null;
                    }

                    return (
                      <TableRow 
                        key={customer.id} 
                        className="hover:bg-emerald-50/50 transition-all duration-200 border-b border-gray-100"
                      >
                        <TableCell className="" style={{ padding: '8px 5px' }}>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar 
                              className="h-7 w-7 sm:h-8 sm:w-8 bg-emerald-100 text-emerald-800 text-[8px] sm:text-[8px] sm:text-xs" 
                              fallback={getInitials(customer.name)} 
                            />
                            <div className="font-medium text-gray-900 text-[8px] sm:text-sm">
                              {customer.name || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell" style={{ padding: '8px 5px' }}>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-[8px] sm:text-xs text-gray-500">
                              <Mail className="h-3 w-3" /> {customer.email || 'N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-[8px] sm:text-xs text-gray-500">
                              <Phone className="h-3 w-3" /> {customer.phone || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 text-[8px] sm:text-sm hidden lg:table-cell text" style={{ padding: '8px 5px' }}>
                          {customer.joined || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-900 font-medium text-[8px] sm:text-sm text-center" style={{ padding: '8px 5px' }}>
                          {customer.orders ?? 0}
                        </TableCell>
                        <TableCell className="text-gray-900 font-bold text-[8px] sm:text-sm" style={{ padding: '8px 5px' }}>
                          ₹{customer.totalSpent?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell className="" style={{ padding: '8px 5px' }}>
                          <Badge variant={customer.status === 'Active' ? 'success' : 'secondary'} className="text-[8px] sm:text-xs">
                            {customer.status || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" style={{ padding: '10px' }}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[8px] sm:text-sm h-7 sm:h-8"
                            onClick={() => navigate(`/admin/customers/${customer.id}`)}
                          >
                            <span className="hidden sm:inline">Details</span>
                            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 sm:ml-2" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersList;
