import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit2, Save, X, Camera, Lock, Heart, ShoppingBag, Package, CreditCard, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    firstName: 'Bikram',
    lastName: 'Dumriya',
    email: 'bikram.dumriya@example.com',
    phone: '+91 9999999999',
    dateOfBirth: '1995-05-15',
    gender: 'Male',
    address: {
      street: 'A/B, Section Lane',
      city: 'Odisha',
      state: 'Noida',
      pincode: '744115',
      country: 'India'
    }
  });

  const [tempData, setTempData] = useState({ ...profileData });

  const stats = [
    { icon: ShoppingBag, label: 'Total Orders', value: '24' },
    { icon: Package, label: 'Pending', value: '3' },
    { icon: Heart, label: 'Wishlist', value: '12' },
    { icon: CreditCard, label: 'Saved Cards', value: '2' }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setTempData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setTempData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
  

      <main className="grow w-full" style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="w-full" style={{ paddingRight: '8rem',paddingLeft: '8rem' }}>
          <div className=" mx-auto">
          {/* Header Section */}
          <div className="bg-linear-to-r from-teal-400 to-cyan-400 rounded-2xl p-8 mb-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden">
                  <User size={64} color="#A5E8DC" strokeWidth={1.5} />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Camera size={20} color="#000000" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: '8px'
                  }}
                >
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '16px'
                  }}
                >
                  {profileData.email}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    Premium Member
                  </span>
                  <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    Joined Nov 2024
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
                  >
                    <stat.icon size={24} color="#FFFFFF" className="mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/80">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: 'Gyrotrope', fontSize: '16px' }}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#000000'
                  }}
                >
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors cursor-pointer"
                    style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600 }}
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600 }}
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600 }}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form Fields */}
                <div>
                  <label style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={isEditing ? tempData.firstName : profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    style={{ fontFamily: 'Gyrotrope', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={isEditing ? tempData.lastName : profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    style={{ fontFamily: 'Gyrotrope', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={isEditing ? tempData.email : profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    style={{ fontFamily: 'Gyrotrope', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={isEditing ? tempData.phone : profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    style={{ fontFamily: 'Gyrotrope', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={isEditing ? tempData.dateOfBirth : profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    style={{ fontFamily: 'Gyrotrope', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                    Gender
                  </label>
                  <select
                    value={isEditing ? tempData.gender : profileData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 cursor-pointer"
                    style={{ fontFamily: 'Gyrotrope', fontSize: '16px' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={isEditing ? tempData.address.street : profileData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    style={{ fontFamily: 'Gyrotrope', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={isEditing ? tempData.address.city : profileData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    style={{ fontFamily: 'Gyrotrope', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={isEditing ? tempData.address.state : profileData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    style={{ fontFamily: 'Gyrotrope', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={isEditing ? tempData.address.pincode : profileData.address.pincode}
                    onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    style={{ fontFamily: 'Gyrotrope', fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                    Country
                  </label>
                  <input
                    type="text"
                    value={isEditing ? tempData.address.country : profileData.address.country}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50"
                    style={{ fontFamily: 'Gyrotrope', fontSize: '16px' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== 'profile' && (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p style={{ fontFamily: 'Gyrotrope', fontSize: '18px', color: '#6B7280' }}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section coming soon...
              </p>
            </div>
          )}
        </div>
        </div>
      </main>

      
    </div>
  );
};

export default UserProfile;
