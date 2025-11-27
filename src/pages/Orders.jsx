import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { PharmacyProductCard } from '@/components/features/product';
import { OrderCard } from '@/components/features/order';

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const orders = [
    {
      id: '964368966',
      productName: 'Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules',
      customerName: 'Bikram Dumriya',
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
      customerName: 'Bikram Dumriya',
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
      customerName: 'Bikram Dumriya',
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
      customerName: 'Bikram Dumriya',
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
      customerName: 'Bikram Dumriya',
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
      customerName: 'Bikram Dumriya',
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
    <div style={{ paddingTop: '140px' }}>
        <div className="w-full px-6 lg:px-12 flex flex-col items-center" style={{ marginBottom: '30px' }}>
          <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-16">
              <h1
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#000000',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  lineHeight: '1.2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Orders
              </h1>

              {/* Search and Filter Bar - Right Side */}
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Your Order"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-12 focus:outline-none transition-all"
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#000000',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #A5E8DC',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      width: '260px',
                      height: '32px'
                    }}
                  />
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-200 hover:opacity-80 cursor-pointer"
                    style={{
                      backgroundColor: '#A5E8DC',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    aria-label="Search"
                  >
                    <Search size={18} color="#000000" strokeWidth={2.5} />
                  </button>
                </div>
                <button
                  className="transition-all duration-200 hover:opacity-90 whitespace-nowrap cursor-pointer flex items-center gap-2"
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontSize: '14px',
                    fontWeight: 600,
                    backgroundColor: '#A5E8DC',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    height: '32px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  Filter
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3 mb-16 mt-20">
            {orders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))}
          </div>

          {/* Suggested Items Section */}
          <div>
            <h2
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '24px',
                fontWeight: 700,
                color: '#1F2937',
                marginBottom: '20px',
                marginTop: '20px',
                letterSpacing: '-0.02em'
              }}
            >
            <span
               style={{
                textDecoration: 'underline',
                textDecorationSkipInk: 'auto',
                textUnderlineOffset: '4px',
                textDecorationThickness: '2px',
                textDecorationColor: '#111827',
                display: 'inline-block',
                lineHeight: '1.2',
              }}
            >
              Suggested Items
            </span>
              
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8" style={{ marginBottom: '20px' }}>
              {suggestedItems.map((item) => (
                <PharmacyProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  discount={item.discount}
                  quantity="1 piece"
                  imageUrl={item.image}
                />
              ))}
            </div>
          </div>
        </div>
        </div>
    </div>
  );
};

export default Orders;
