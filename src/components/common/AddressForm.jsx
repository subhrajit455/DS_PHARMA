import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { MapPin, Home, Briefcase, Save, Loader2, User, Phone, X } from 'lucide-react';

const AddressForm = ({ initialData, onSave, onCancel, isSaving, title }) => {
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

    const inputClasses = "w-full text-xs pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:border-emerald-300";
    const labelClasses = "block mb-2 text-xs sm:text-sm font-medium text-gray-700";

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white rounded-2xl p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                    {title || (initialData ? 'Edit Address' : 'Add New Address')}
                </h3>
                {onCancel && (
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className={labelClasses}>Address Type</label>
                    <div className="flex gap-4">
                        {['Home', 'Work', 'Other'].map(type => (
                            <button
                                style={{padding: '0px 5px'}}
                                key={type}
                                type="button"
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
                                <span className="text-sm font-medium" style={{marginTop: '5px',}}>{type}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <label className={labelClasses}>Recipient Name</label>
                    <div className="relative">
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <User size={18} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={inputClasses}
                            placeholder="Receiver's Name"
                        />
                    </div>
                </div>

                <div className="relative">
                    <label className={labelClasses} style={{marginTop: ''}}>Phone Number</label>
                    <div className="relative">
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Phone size={18} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className={inputClasses}
                            placeholder="10-digit mobile number"
                        />
                    </div>
                </div>

                <div className="md:col-span-2 relative">
                    <label className={labelClasses}>Address (House No, Building, Street)</label>
                    <div className="relative">
                        <div className="absolute left-2 top-3 text-gray-400 pointer-events-none">
                            <MapPin size={18} />
                        </div>
                        <textarea
                            style={{padding: '14px 30px'}}
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className={`${inputClasses} min-h-[100px] pt-3`}
                            placeholder="Full address"
                        />
                    </div>
                </div>

                <div className="relative">
                    <label className={labelClasses}>City</label>
                    <div className="relative">
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <MapPin size={18} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className={inputClasses}
                            placeholder="City"
                        />
                    </div>
                </div>

                <div className="relative">
                    <label className={labelClasses}>State</label>
                    <div className="relative">
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <MapPin size={18} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                            className={inputClasses}
                            placeholder="State"
                        />
                    </div>
                </div>

                <div className="relative">
                    <label className={labelClasses}>Pincode</label>
                    <div className="relative">
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <MapPin size={18} />
                        </div>
                        <input
                            style={{padding: '10px 30px'}}
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => handleChange('pincode', e.target.value)}
                            className={inputClasses}
                            placeholder="6-digit pincode"
                        />
                    </div>
                </div>
                
                <div className="flex items-center gap-2 top-5" style={{marginTop: '20px'}}>
                    <input 
                        type="checkbox" 
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => handleChange('isDefault', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="isDefault" className="text-sm text-gray-600 cursor-pointer" style={{marginTop: '5px'}}>Set as default address</label>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8" style={{marginTop: '10px'}}>
                {onCancel && (
                    <button
                        style={{padding: '5px 10px'}}
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    style={{padding: '5px 10px'}}
                    type="button"
                    onClick={() => onSave(formData)}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-200"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    <span>Save Address</span>
                </button>
            </div>
        </Motion.div>
    );
};

export default AddressForm;
