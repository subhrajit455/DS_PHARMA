import React from 'react';
import { motion as Motion } from 'framer-motion';
import { MapPin, Edit2 } from 'lucide-react';
import { useAddresses, useUpdateAddress } from '@/hooks/queries/useAddresses';

const AddressesList = () => {
    // Fetch addresses using React Query
    const { data: addressesData, isLoading } = useAddresses();
    const { mutate: updateAddress } = useUpdateAddress();

    // Mock data as fallback
    const mockAddresses = [
        { id: 1, type: 'Home', name: 'Gourav Gupta', address: 'A/B, Section Lane, Odisha, Noida', pincode: '744115', phone: '+91 9999999999', isDefault: true },
        { id: 2, type: 'Work', name: 'Gourav Gupta', address: '123 Business Park, Sector 62', pincode: '201301', phone: '+91 9999999999', isDefault: false }
    ];

    const addresses = addressesData?.data || mockAddresses;

    const handleSetDefault = (id) => {
        // Optimistically update or just call API
        updateAddress({ id, data: { isDefault: true } });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-4 md:p-8"
        >
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: 'Gyrotrope', color: '#1F2937' }}>
                    Saved Addresses
                </h2>
                <Motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-md text-sm font-semibold"
                >
                    <MapPin className="w-4 h-4" />
                    Add New Address
                </Motion.button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {addresses.map((addr, index) => (
                    <Motion.div
                        key={addr.id || index}
                        whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                        className="border-2 border-gray-200 rounded-xl p-5 hover:border-teal-400 transition-all bg-gradient-to-br from-white to-gray-50 relative"
                    >
                        {addr.isDefault && (
                            <div className="absolute top-3 right-3">
                                <span className="px-3 py-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full text-[8px] sm:text-xs font-bold shadow-md">
                                    ⭐ Default
                                </span>
                            </div>
                        )}
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-teal-100 rounded-lg">
                                <MapPin className="w-5 h-5 text-teal-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-lg mb-1" style={{ fontFamily: 'Gyrotrope' }}>{addr.type}</p>
                                <p className="font-semibold text-sm text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>{addr.name}</p>
                            </div>
                        </div>
                        <div className="ml-11 space-y-2 mb-4">
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Gyrotrope' }}>
                                {addr.address}
                            </p>
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Gyrotrope' }}>
                                PIN: <span className="font-semibold">{addr.pincode}</span>
                            </p>
                            <p className="text-sm text-gray-600" style={{ fontFamily: 'Gyrotrope' }}>
                                📱 {addr.phone}
                            </p>
                        </div>
                        <div className="flex gap-2 ml-11">
                            <button className="flex-1 px-3 py-2 text-sm font-medium text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
                                <Edit2 className="w-3 h-3 inline mr-1" />
                                Edit
                            </button>
                            {!addr.isDefault && (
                                <button 
                                    onClick={() => handleSetDefault(addr.id)}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Set Default
                                </button>
                            )}
                        </div>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>
    );
};

export default AddressesList;
