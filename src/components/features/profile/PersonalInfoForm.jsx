import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Edit2, Save, X } from 'lucide-react';

const PersonalInfoForm = ({
    profileData,
    tempData,
    isEditing,
        handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    isSaving
}) => {
    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
        >
            <div className="flex justify-between items-center mb-6" style={{ padding: '10px' }}>
                <h2
                    className="text-lg md:text-2xl font-semibold"
                    style={{
                        fontFamily: 'Gyrotrope',
                        color: '#000000'
                    }}
                >
                    Personal Information
                </h2>
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white transition-colors bg-teal-500 rounded-lg cursor-pointer hover:bg-teal-600"
                        style={{ fontFamily: 'Gyrotrope', padding: '5px 10px' }}
                    >
                        <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Edit Profile</span>
                        <span className="sm:hidden">Edit</span>
                    </button>
                ) : (
                    <div className="gap-1 md:gap-2" style={{ padding: '5px 0px' }}>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white transition-colors bg-green-500 rounded-lg cursor-pointer hover:bg-green-600 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{ fontFamily: 'Gyrotrope', padding: '2px 5px' }}
                        >
                            {isSaving ? (
                                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Save className="w-3 h-3 md:w-4 md:h-4" />
                            )}
                            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                            <span className="sm:hidden">{isSaving ? '...' : 'Save'}</span>
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white transition-colors bg-gray-500 rounded-lg cursor-pointer hover:bg-gray-600"
                            style={{ fontFamily: 'Gyrotrope', padding: '2px 5px' }}
                        >
                            <X className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Cancel</span>
                            <span className="sm:hidden">Cancel</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ padding: ' 5px 15px' }}>
                {/* Form Fields */}
                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
                        First Name
                    </label>
                    <input
                        type="text"
                        value={isEditing ? tempData.firstName : profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                        style={{ fontFamily: 'Gyrotrope' }}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
                        Last Name
                    </label>
                    <input
                        type="text"
                        value={isEditing ? tempData.lastName : profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                        style={{ fontFamily: 'Gyrotrope' }}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={isEditing ? tempData.email : profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                        style={{ fontFamily: 'Gyrotrope' }}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={isEditing ? tempData.phone : profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                        style={{ fontFamily: 'Gyrotrope' }}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        value={isEditing ? tempData.dateOfBirth : profileData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                        style={{ fontFamily: 'Gyrotrope' }}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
                        Gender
                    </label>
                    <select
                        value={isEditing ? tempData.gender : profileData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 cursor-pointer"
                        style={{ fontFamily: 'Gyrotrope' }}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
                        Street Address
                    </label>
                    <input
                        type="text"
                        value={isEditing ? tempData.address.street : profileData.address.street}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                        style={{ fontFamily: 'Gyrotrope' }}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
                        City
                    </label>
                    <input
                        type="text"
                        value={isEditing ? tempData.address.city : profileData.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                        style={{ fontFamily: 'Gyrotrope' }}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
                        State
                    </label>
                    <input
                        type="text"
                        value={isEditing ? tempData.address.state : profileData.address.state}
                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                        style={{ fontFamily: 'Gyrotrope' }}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
                        Pincode
                    </label>
                    <input
                        type="text"
                        value={isEditing ? tempData.address.pincode : profileData.address.pincode}
                        onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                        style={{ fontFamily: 'Gyrotrope' }}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Gyrotrope' }}>
                        Country
                    </label>
                    <input
                        type="text"
                        value={isEditing ? tempData.address.country : profileData.address.country}
                        onChange={(e) => handleInputChange('address.country', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                        style={{ fontFamily: 'Gyrotrope', marginBottom: '15px' }}
                    />
                </div>
            </div>
        </Motion.div>
    );
};

export default PersonalInfoForm;
