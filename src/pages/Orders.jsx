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
      totalItems: totalItems, // ✅ Use separate field for count
      // items: order.items, // ✅ Keep original items array (already in ...order)
      productName: order.items?.[0]?.productName || order.items?.[0]?.name || 'Order',
      image: order.items?.[0]?.image || order.items?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
      total: order.totals?.total || order.paymentBreakdown?.total || 0,
      date: order.date || new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric", 
        month: "short",
        year: "numeric"
      })
    };
  });

  // Filter orders based on search query
  const filteredOrders = allOrders.filter(order => 
    order.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id?.toString().includes(searchQuery)
  );

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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 md:mb-12 lg:mb-16">
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
              <div className="flex gap-2 md:gap-3 items-center w-full md:w-auto">
                <div className="relative flex-1 md:flex-initial">
                  <input
                    type="text"
                    placeholder="Search Your Order"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 md:pr-12 focus:outline-none transition-all text-[8px] sm:text-xs md:text-sm"
                    style={{
                      fontFamily: 'Gyrotrope',
                      color: '#000000',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #A5E8DC',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      minWidth: '180px',
                      maxWidth: '100%',
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
                <button
                  className="transition-all duration-200 hover:opacity-90 whitespace-nowrap cursor-pointer flex items-center gap-1 md:gap-2 text-[8px] sm:text-xs md:text-sm"
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontWeight: 600,
                    backgroundColor: '#A5E8DC',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    height: '36px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  Filter
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
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



