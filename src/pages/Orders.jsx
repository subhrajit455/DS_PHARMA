import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { PharmacyProductCard } from '@/components/features/product';
import { OrderCard } from '@/components/features/order';
import SuggestedItemsSection from '@/components/sections/SuggestedItemsSection';

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const orders = [
    {
      id: '964368966',
      productName: 'Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules',
      customerName: 'Gourav Gupta',
      phone: '4664938723',
      address: 'A/B, Section Lane, Odisha, Noida, 744115',
      status: 'In Process',
      statusColor: '#FF7A59',
      statusBg: '#FF7A59',
      expectedDelivery: '18th Dec, 2025',
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: '964368967',
      productName: 'Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules',
      customerName: 'Gourav Gupta',
      phone: '4664938723',
      address: 'A/B, Section Lane, Odisha, Noida, 744115',
      status: 'Waiting For Pick Up',
      statusColor: '#FF8C6B',
      statusBg: '#FF8C6B',
      expectedDelivery: '18th Dec, 2025',
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: '964368968',
      productName: 'Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules',
      customerName: 'Gourav Gupta',
      phone: '4664938723',
      address: 'A/B, Section Lane, Odisha, Noida, 744115',
      status: 'On the Way',
      statusColor: '#FF9E7D',
      statusBg: '#FF9E7D',
      expectedDelivery: '18th Dec, 2025',
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: '964368969',
      productName: 'Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules',
      customerName: 'Gourav Gupta',
      phone: '4664938723',
      address: 'A/B, Section Lane, Odisha, Noida, 744115',
      status: 'Out For Delivery',
      statusColor: '#5FD4A0',
      statusBg: '#5FD4A0',
      phoneNumber: '+919999999999 Ext. 121',
      expectedDelivery: '18th Dec, 2025',
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: '964368970',
      productName: 'Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules',
      customerName: 'Gourav Gupta',
      phone: '4664938723',
      address: 'A/B, Section Lane, Odisha, Noida, 744115',
      status: 'Delivered',
      statusColor: '#059669',
      statusBg: '#059669',
      deliveredDate: '17 Dec, 2025',
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: '964368971',
      productName: 'Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules',
      customerName: 'Gourav Gupta',
      phone: '4664938723',
      address: 'A/B, Section Lane, Odisha, Noida, 744115',
      status: 'Returned',
      statusColor: '#FF6B6B',
      statusBg: '#FF6B6B',
      deliveredDate: '17 Dec, 2025',
      image: '/src/assets/images/medicine.jpeg'
    }
  ];

  const suggestedItems = [
    {
      id: 1,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 2,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 3,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 4,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    },
    {
      id: 5,
      name: 'Paracetamol',
      price: 12,
      originalPrice: 15,
      discount: 5,
      image: '/src/assets/images/medicine.jpeg'
    }
  ];


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
          <div className="mb-8 md:mb-12 lg:mb-20">
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
                    className="w-full pr-10 md:pr-12 focus:outline-none transition-all text-xs md:text-sm"
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
                  className="transition-all duration-200 hover:opacity-90 whitespace-nowrap cursor-pointer flex items-center gap-1 md:gap-2 text-xs md:text-sm"
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
          <div className="space-y-3 mb-8 md:mb-12 lg:mb-16 mt-4 md:mt-8 lg:mt-12">
            {orders.map((order, index) => (
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
