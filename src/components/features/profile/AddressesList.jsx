import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { MapPin, Edit2, Plus, Trash2, CheckCircle, X, Home, Briefcase, Save, Loader2, User, Phone } from 'lucide-react';

const AddressForm = ({ initialData, onSave, onCancel, isSaving }) => {
    const [formData, setFormData] = useState(initialData || {
        type: 'Home',
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Matching PersonalInfoForm styling exactly
    const inputClasses = "w-full text-xs pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:border-emerald-300";
    const labelClasses = "block mb-2 text-xs sm:text-sm font-medium text-gray-700";

    return (
        <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-white to-emerald-50/20 rounded-2xl border border-gray-100 shadow-sm p-6 mb-6"
            style={{ margin: '20px 0px' }}
        >
            <div className="flex justify-between items-center mb-6" style={{ padding: '5px' }}>
                <h3 className="text-lg font-bold text-gray-900">{initialData ? 'Edit Address' : 'Add New Address'}</h3>
                <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ padding: '5px' }}>
                <div className="md:col-span-2">
                    <label className={labelClasses}>Address Type</label>
                    <div className="flex gap-4">
                        {['Home', 'Work', 'Other'].map(type => (
                            <button
                                style={{ padding: '0px 5px' }}
                                key={type}
                                onClick={() => handleChange('type', type)}
                                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl border transition-all ${
                                    formData.type === type 
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-emerald-300'
                                }`}
                            >
                                {type === 'Home' && <Home className="w-4 h-4" />}
                                {type === 'Work' && <Briefcase className="w-4 h-4" />}
                                {type === 'Other' && <MapPin className="w-4 h-4" />}
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Name Input with Icon */}
                <div className="relative">
                    <label className={labelClasses}>Recipient Name</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <User size={16} />
                        </div>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={inputClasses}
                            placeholder="Receiver's Name"
                            style={{ padding: '8px 30px' }}
                        />
                    </div>
                </div>

                {/* Phone Input with Icon */}
                <div className="relative">
                    <label className={labelClasses}>Phone Number</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <Phone size={16} />
                        </div>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className={inputClasses}
                            placeholder="10-digit mobile number"
                            style={{ padding: '8px 30px' }}
                        />
                    </div>
                </div>

                {/* Address Input with Icon */}
                <div className="md:col-span-2 relative">
                    <label className={labelClasses}>Address (House No, Building, Street)</label>
                    <div className="relative">
                        <div className="absolute left-2 top-2 text-gray-400 pointer-events-none z-10">
                            <MapPin size={16} />
                        </div>
                        <textarea
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className={inputClasses}
                            rows="2"
                            placeholder="Full address"
                            style={{ padding: '8px 30px' }}
                        />
                    </div>
                </div>

                {/* City Input with Icon */}
                <div className="relative">
                    <label className={labelClasses}>City</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <MapPin size={16} />
                        </div>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className={inputClasses}
                            placeholder="City"
                            style={{ padding: '8px 30px' }}
                        />
                    </div>
                </div>

                {/* State Input with Icon */}
                <div className="relative">
                    <label className={labelClasses}>State</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <MapPin size={16} />
                        </div>
                        <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                            className={inputClasses}
                            placeholder="State"
                            style={{ padding: '8px 30px' }}
                        />
                    </div>
                </div>

                {/* Pincode Input with Icon */}
                <div className="relative">
                    <label className={labelClasses}>Pincode</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <MapPin size={16} />
                        </div>
                        <input
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => handleChange('pincode', e.target.value)}
                            className={inputClasses}
                            placeholder="6-digit pincode"
                            style={{ padding: '8px 30px' }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6" style={{ padding: '10px 5px' }}>
                <button
                    style={{ padding: '2px 5px' }}
                    onClick={onCancel}
                    className="px-6 py-2.5 text-xs sm:text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    style={{ padding: '2px 5px' }}
                    onClick={() => onSave(formData)}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-6 py-2.5 text-xs sm:text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    <span style={{ marginTop: '5px' }}>Save Address</span>
                </button>
            </div>
        </Motion.div>
    );
};

const AddressesList = ({ 
    addressesData,
    addAddress,
    updateAddress,
    deleteAddress,
    isAddingAddress,
    isUpdatingAddress,
    isDeletingAddress
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const displayAddresses = addressesData?.data || [];
    const isSaving = isAddingAddress || isUpdatingAddress;
    const isLoading = !addressesData; // Only show loading if no data at all

    const handleSave = (data) => {
        if (editingId) {
             updateAddress({ id: editingId, data }, {
                 onSuccess: () => {
                     setEditingId(null);
                 }
             });
        } else {
             addAddress(data, {
                 onSuccess: () => {
                     setIsAdding(false);
                 }
             });
        }
    };
    
    const handleSetDefault = (id) => {
         const address = displayAddresses.find(a => a.id === id);
         if (address) {
             updateAddress({ id, data: { ...address, isDefault: true } });
         }
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this address?')) {
            deleteAddress(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        );
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-br from-white to-emerald-50/20 rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            style={{ marginTop: window.innerWidth >= 640 ? '30px' : '0', padding: '10px', marginBottom: '10px' }}
        >
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-linear-to-r from-emerald-50/50 to-white" style={{ marginBottom: '15px' }}>
                <div>
                     <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
                     <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage delivery locations</p>
                </div>
                {!isAdding && !editingId && (
                     <button
                        style={{ padding: '2px 5px' }}
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                     >
                        <Plus className="w-4 h-4" />
                        <span style={{ marginTop: '3px' }}>Add New Address</span>
                     </button>
                )}
             </div>

             <div className="p-6">
                <AnimatePresence>
                    {(isAdding || editingId) && (
                         <AddressForm 
                            initialData={editingId ? displayAddresses.find(a => a.id === editingId) : null}
                            onSave={handleSave}
                            onCancel={() => {
                                setIsAdding(false);
                                setEditingId(null);
                            }}
                            isSaving={isSaving}
                         />
                    )}
                </AnimatePresence>

                {displayAddresses.length === 0 && !isAdding ? (
                     <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-gray-900 font-medium mb-1">No addresses found</h3>
                        <p className="text-gray-500 text-sm mb-4">Add an address to speed up checkout</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline"
                        >
                            Add your first address
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ padding: '5px' }}>
                        {displayAddresses.map((addr) => (
                            <Motion.div
                                style={{ padding: '5px' }}
                                key={addr.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`group relative p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                                    addr.isDefault 
                                    ? 'border-emerald-500 bg-emerald-50/30' 
                                    : 'border-gray-100 bg-white hover:border-emerald-200'
                                }`}
                            >
                                {addr.isDefault && (
                                     <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full"
                                        style={{ padding: '2px 5px' }}
                                        >
                                         <CheckCircle className="w-3 h-3" />
                                         <span style={{ marginTop: '3px' }}>Default</span>
                                     </div>
                                )}

                                {!addr.isDefault && (
                                         <button 
                                            style={{ padding: '2px 5px' }}
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-full transition-colors cursor-pointer border border-emerald-200 hover:border-emerald-400"
                                         >
                                             <span style={{ marginTop: '3px' }}>Set as Default</span>
                                         </button>
                                     )}
                                
                                <div className="flex items-start gap-3 mb-4">
                                     <div className={`p-2.5 rounded-lg ${
                                         addr.type === 'Home' ? 'bg-blue-100 text-blue-600' : 
                                         addr.type === 'Work' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                                     }`}>
                                         {addr.type === 'Home' && <Home className="w-5 h-5" />}
                                         {addr.type === 'Work' && <Briefcase className="w-5 h-5" />}
                                         {['Home', 'Work'].indexOf(addr.type) === -1 && <MapPin className="w-5 h-5" />}
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-gray-900">{addr.type}</h4>
                                         <p className="text-xs sm:text-sm font-medium text-gray-600">{addr.name}</p>
                                     </div>
                                </div>
                                
                                <div className="space-y-1 mb-5 pl-13" style={{ paddingLeft: '33px' }}>
                                     <p className="text-xs text-gray-600 leading-relaxed">
                                         {addr.address}<br />
                                         {addr.city}, {addr.state} - <span className="font-medium text-gray-900">{addr.pincode}</span>
                                     </p>
                                     <p className="text-xs text-gray-500 mt-2">
                                         Mobile: <span className="font-medium text-gray-700">{addr.phone}</span>
                                     </p>
                                </div>
                                
                                <div className="flex items-end justify-end gap-2 pl-13 pt-3 border-t border-gray-100 opacity-60 group-hover:opacity-100 transition-opacity">
                                     <button 
                                        style={{ padding: '2px 5px' }}
                                        onClick={() => setEditingId(addr.id)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                     >
                                         <Edit2 className="w-3 h-3" /> <span style={{ marginTop: '3px' }}>Edit</span>
                                     </button>
                                     <button 
                                        style={{ padding: '2px 5px' }}
                                        onClick={() => handleDelete(addr.id)}
                                        disabled={isDeletingAddress}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                     >
                                         <Trash2 className="w-3 h-3" /> <span style={{ marginTop: '3px' }}>Delete</span>
                                     </button>
                                     
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                )}
             </div>
        </Motion.div>
    );
};

export default AddressesList;
