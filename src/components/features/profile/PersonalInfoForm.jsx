import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Edit2, Save, X, User, Mail, Phone, Calendar, Users } from 'lucide-react';

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
    // Helper to get first/last name from single name field if needed
    const getFirstName = (data) => data.firstName || data.name?.split(' ')[0] || '';
    const getLastName = (data) => data.lastName || data.name?.split(' ').slice(1).join(' ') || '';

    // Initialize values logic
    const currentFirstName = isEditing ? (tempData.firstName !== undefined ? tempData.firstName : getFirstName(tempData)) : getFirstName(profileData);
    const currentLastName = isEditing ? (tempData.lastName !== undefined ? tempData.lastName : getLastName(tempData)) : getLastName(profileData);

    const inputClasses = "w-full text-xs pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:border-emerald-300";
    const labelClasses = "block mb-2 text-sm font-medium text-gray-700";

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-emerald-50/20 rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            style={{marginTop: '20px', padding: '10px', marginBottom: '10px'}}
        >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-50/50 to-white" style={{ marginBottom: '15px'}}>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your personal details</p>
                </div>
                
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                        style={{ padding: '2px 10px'}}
                    >
                        <Edit2 className="w-4 h-4" />
                        <span style={{ marginTop: '3px'}}>Edit Details</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                         <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            style={{ padding: '2px 10px'}}
                        >
                            <X className="w-4 h-4" />
                            <span style={{ marginTop: '3px'}}>Cancel</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            style={{ padding: '2px 10px'}}
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            <span style={{ marginTop: '3px'}}>Save Changes</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="relative">
                    <label className={labelClasses}>First Name</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <User size={16} />
                        </div>
                        <input
                            style={{ padding:'8px 30px'}}
                            type="text"
                            value={currentFirstName}
                            onChange={(e) => {
                                const newFirst = e.target.value;
                                handleInputChange('firstName', newFirst);
                                const currentLast = tempData.lastName !== undefined ? tempData.lastName : getLastName(tempData);
                                handleInputChange('name', `${newFirst} ${currentLast}`.trim());
                            }}
                            disabled={!isEditing}
                            className={inputClasses}
                            placeholder="Enter first name"
                        />
                    </div>
                </div>

                {/* Last Name */}
                <div className="relative">
                    <label className={labelClasses}>Last Name</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <User size={16} />
                        </div>
                        <input
                            style={{ padding:'8px 30px'}}
                            type="text"
                            value={currentLastName}
                            onChange={(e) => {
                                const newLast = e.target.value;
                                handleInputChange('lastName', newLast);
                                 const currentFirst = tempData.firstName !== undefined ? tempData.firstName : getFirstName(tempData);
                                 handleInputChange('name', `${currentFirst} ${newLast}`.trim());
                            }}
                            disabled={!isEditing}
                            className={inputClasses}
                            placeholder="Enter last name"
                        />
                    </div>
                </div>

                {/* Email Address */}
                <div className="relative">
                    <label className={labelClasses}>Email Address</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <Mail size={16} />
                        </div>
                        <input
                            style={{ padding:'8px 30px'}}
                            type="email"
                            value={isEditing ? tempData.email : profileData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={!isEditing}
                            className={inputClasses}
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="relative">
                    <label className={labelClasses}>Phone Number</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <Phone size={16} />
                        </div>
                        <input
                            style={{ padding:'8px 30px'}}
                            type="tel"
                            value={isEditing ? tempData.phone : profileData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!isEditing}
                            className={inputClasses}
                            placeholder="+91 99999 99999"
                        />
                    </div>
                </div>

                {/* Date of Birth */}
                <div className="relative">
                    <label className={labelClasses}>Date of Birth</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <Calendar size={16} />
                        </div>
                        <input
                            style={{ padding:'8px 30px'}}
                            type="date"
                            value={isEditing ? tempData.dateOfBirth : profileData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            disabled={!isEditing}
                            className={inputClasses}
                        />
                    </div>
                </div>

                {/* Gender */}
                <div className="relative">
                    <label className={labelClasses}>Gender</label>
                    <div className="relative">
                        <div className="absolute left-2 top-[45%] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <Users size={16} />
                        </div>
                        <select
                            style={{ padding:'10px 30px'}}
                            value={isEditing ? tempData.gender : profileData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            disabled={!isEditing}
                            className={inputClasses}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>
        </Motion.div>
    );
};

export default PersonalInfoForm;
