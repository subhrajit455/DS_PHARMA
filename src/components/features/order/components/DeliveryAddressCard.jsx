import React, { useState, useRef, useEffect } from 'react';
import { Card, Button } from '@/components/ui';
import { ChevronDown, MapPin, Check } from 'lucide-react';

const SAMPLE_ADDRESSES = [
  {
    id: '1',
    name: 'Gourav Gupta',
    phone: '+91 98765 43210',
    address: '123, Tech Park Road, Sector 62, Noida, Uttar Pradesh - 201301',
    type: 'Home'
  },
  {
    id: '2',
    name: 'Gourav Gupta',
    phone: '+91 98765 43210',
    address: '456, Cyber City, DLF Phase 3, Gurugram, Haryana - 122002',
    type: 'Work'
  },
  {
    id: '3',
    name: 'Gourav Gupta',
    phone: '+91 98765 43210',
    address: '789, Indiranagar, 100 Feet Road, Bengaluru, Karnataka - 560038',
    type: 'Other'
  }
];

const DeliveryAddressCard = ({ address, onChangeAddress, className }) => {
  const [currentAddress, setCurrentAddress] = useState(address || SAMPLE_ADDRESSES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync with prop if it changes initially or externally
  useEffect(() => {
    if (address) {
      setCurrentAddress(address);
    }
  }, [address]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddressSelect = (selectedAddr) => {
    setCurrentAddress(selectedAddr);
    setIsOpen(false);
    if (onChangeAddress) {
      onChangeAddress(selectedAddr);
    }
  };

  if (!currentAddress) return null;

  return (
    <Card className={`p-3 sm:p-4 mb-[10px] lg:mb-0 relative ${className || ''}`} style={{ padding: '10px 5px' }}>
      <div className="flex flex-col h-full justify-between">
        <div className="flex-1">
          <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-[#34B485]" style={{ fontFamily: 'Gyrotrope', margin: '8px sm:12px' }}>
            Delivery Address
          </h3>

          <div className="mb-2 sm:mb-3 text-[10px] sm:text-xs leading-relaxed text-gray-700" style={{ fontFamily: 'Gyrotrope', margin: '8px sm:12px' }}>
            <p className="mb-1 font-semibold flex items-center gap-2">
              {currentAddress.name} - {currentAddress.phone}
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[9px] font-medium border border-gray-200">
                {currentAddress.type || 'Home'}
              </span>
            </p>
            <p className="text-gray-600 line-clamp-2">
              {currentAddress.address}
              {currentAddress.city ? `, ${currentAddress.city}, ${currentAddress.state} - ${currentAddress.postalCode}` : ''}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-auto relative" ref={dropdownRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className='text-[10px] sm:text-xs flex items-center gap-1.5 hover:bg-gray-50 transition-colors border-gray-300'
            style={{
              padding: '4px 8px sm:6px sm:14px',
              width: 'auto',
              margin: '8px sm:12px',
              fontFamily: 'Gyrotrope',
              fontWeight: 600,
              color: '#000000',
              borderRadius: '8px',
              height: '30px',
              backgroundColor: 'transparent'
            }}
          >
            Change Address
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </Button>

          {/* Dropdown Menu - Matching OrderSummary style */}
          {isOpen && (
            <div
              className="absolute right-0 bottom-full mb-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
              style={{ animation: 'fadeIn 0.2s ease-out' }}
            >
              <div className="p-2 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 px-2">Select Delivery Location</span>
              </div>

              <div className="max-h-64 overflow-y-auto py-1 custom-scrollbar">
                {SAMPLE_ADDRESSES.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => handleAddressSelect(addr)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group relative"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${currentAddress?.id === addr.id ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                        <MapPin size={14} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-semibold text-xs text-gray-900">{addr.type}</span>
                          {currentAddress?.id === addr.id && (
                            <Check size={14} className="text-emerald-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {addr.address}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DeliveryAddressCard;