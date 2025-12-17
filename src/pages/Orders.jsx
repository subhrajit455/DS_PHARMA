import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { PharmacyProductCard } from '@/components/features/product';
import { OrderCard } from '@/components/features/order';
import SuggestedItemsSection from '@/components/sections/SuggestedItemsSection';
import { useOrders } from '@/hooks/queries/useOrders';
import { useProducts } from '@/hooks/queries/useProducts';
import useDataStore from '@/store/useDataStore';

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  const currentUser = useDataStore((state) => state.currentUser);
  
  // Fetch orders using React Query (API orders)
  const { data: ordersData } = useOrders();

  // Get API orders and filter by current user
  const apiOrders = ordersData?.data || [];
  
  // Filter by current user
  const userOrders = apiOrders.filter(order => 
    order.customerId === currentUser?.id || 
    order.customerName === currentUser?.name
  );
  
  // Map orders with correct data
  const allOrders = userOrders.map(order => {
    // Calculate total items from items array
    const totalItems = order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
    
    return {
      ...order,
      totalItems: totalItems, 
      productName: order.items?.[0]?.productName || order.items?.[0]?.name || 'Order',
      image: order.items?.[0]?.image || order.items?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
      total: order.totals?.total || order.paymentBreakdown?.total || 0,
      date: order.date || new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric", 
        month: "short",
        year: "numeric"
      }),
      // Normalize status for filtering
      normalizedStatus: (order.status || 'Pending').toLowerCase()
    };
  });

  // Filter orders based on search query AND filters
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = 
      order.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || order.normalizedStatus === statusFilter.toLowerCase();
    
    let matchesDate = true;
    if (dateFilter !== 'All') {
      const orderDate = new Date(order.createdAt || order.date);
      const today = new Date();
      if (dateFilter === 'Last 30 Days') {
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
        matchesDate = orderDate >= thirtyDaysAgo;
      } else if (dateFilter === 'Last 6 Months') {
        const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));
        matchesDate = orderDate >= sixMonthsAgo;
      } else if (dateFilter === '2024') {
        matchesDate = orderDate.getFullYear() === 2024;
      } else if (dateFilter === '2023') {
        matchesDate = orderDate.getFullYear() === 2023;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDateFilter('All');
  };

  // Use products from sampleData for suggestions
  // Suggestions
  const { data: suggestionsData } = useProducts({ limit: 5 });
  const suggestedItems = suggestionsData?.data || [];


  return (
    <div style={{ paddingTop: '60px' }}>
      <style>{`
        @media (min-width: 768px) {
          .orders-container {
            padding-top: 80px !important;
          }
        }
        @media (max-width: 639px) {
          .orders-container {
            padding-left: 5px !important;
            padding-right: 5px !important;
          }
        }
        @media (min-width: 640px) and (max-width: 1290px) {
          .orders-container {
            padding-left: 5px !important;
            padding-right: 5px !important;
          }
        }
      `}</style>
      <div className="orders-container w-full px-4 md:px-6 lg:px-12 flex flex-col items-center mb-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 md:mb-12 lg:mb-20" style={{ marginBottom: '10px'}}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <h1
                className="text-xl md:text-2xl font-semibold"
                style={{
                  fontFamily: 'Gyrotrope',
                  color: '#000000',
                  margin: 0,
                  lineHeight: '1.2'
                }}
              >
                Orders
              </h1>

              {/* Search and Filter Bar */}
              <div className="flex flex-row gap-2 md:gap-3 items-end sm:items-center w-full md:w-auto">
                <div className="relative w-full sm:w-auto flex-1 md:flex-initial">
                  <input
                    type="text"
                    placeholder="Search by Order ID, Product, Status"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 md:pr-12 min-w-[350px] max-w-[400px] focus:outline-none transition-all text-[10px] sm:text-xs md:text-sm"
                    style={{
                      fontFamily: 'Gyrotrope',
                      color: '#000000',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #A5E8DC',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      height: '36px'
                    }}
                  />
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-200 hover:opacity-80 cursor-pointer"
                    style={{
                      backgroundColor: '#A5E8DC',
                      borderRadius: '6px',
                      padding: '6px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '3px'
                    }}
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4 md:w-5 md:h-5" color="#000000" strokeWidth={2.5} />
                  </button>
                </div>
                
                <div className='flex gap-2 w-full sm:w-auto'>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1 sm:flex-initial transition-all duration-200 hover:opacity-90 whitespace-nowrap cursor-pointer flex items-center justify-center gap-1 md:gap-2 text-[10px] sm:text-xs md:text-sm"
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontWeight: 600,
                      backgroundColor: showFilters ? '#34B485' : '#A5E8DC',
                      color: showFilters ? '#FFFFFF' : '#000000',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      height: '36px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    <span className="hidden sm:inline-block">Filter</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>

                  
                </div>
              </div>
            </div>

            {/* Filter Options Panel */}
            {showFilters && (
              <div className="w-full bg-white border border-teal-100 rounded-xl p-3 sm:p-4 mb-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <div 
                className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 "
                style={{ backgroundColor: '#F0FDFA', padding: '10px', marginTop: '10px' }}
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-gyrotrope">Order Status</label>
                  <select 
                    style={{ padding: '8px 5px' }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-gyrotrope"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-gyrotrope">Time Period</label>
                  <select 
                    style={{ padding: '8px 5px' }}
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none bg-white font-gyrotrope"
                  >
                    <option value="All">All Time</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                    <option value="Last 6 Months">Last 6 Months</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <button

                  onClick={clearFilters}
                  className="transition-all duration-200 hover:text-red-600 whitespace-nowrap cursor-pointer text-[10px] sm:text-xs font-medium text-gray-500"
                  style={{ fontFamily: 'Gyrotrope', padding: '5px 10px', marginRight: '10px' }}
                >
                  <span className="mr-1">Reset</span>
                </button>
              </div>
              </div>
            )}
          </div>

          {/* Orders List */}
          <div 
            className="space-y-3 mb-8 md:mb-12 lg:mb-16 mt-4 md:mt-8 lg:mt-12"
            style={{
              maxHeight: '700px',
              minHeight: '600px',
              overflowY: 'auto',
              paddingRight: '5px',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE and Edge
            }}
          >
            <style>{`
              .space-y-3::-webkit-scrollbar {
                display: none; /* Chrome, Safari, Opera */
              }
            `}</style>
            {filteredOrders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))}
          </div>

          {/* Suggested Items Section */}
          <SuggestedItemsSection
            title="Suggested Items"
            items={suggestedItems}
            titleStyle={{
              color: '#1F2937',
              marginBottom: '20px',
              marginTop: '20px'
            }}
            containerStyle={{ marginBottom: '20px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;



