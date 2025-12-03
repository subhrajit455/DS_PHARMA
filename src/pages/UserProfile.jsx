import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Package, CreditCard, MapPin, Lock, User, ArrowLeft } from 'lucide-react';
import Footer from '@/components/sections/Footer';
import ProfileHeader from '@/components/features/profile/ProfileHeader';
import ProfileStats from '@/components/features/profile/ProfileStats';
import ProfileTabs from '@/components/features/profile/ProfileTabs';
import PersonalInfoForm from '@/components/features/profile/PersonalInfoForm';
import OrdersList from '@/components/features/profile/OrdersList';
import AddressesList from '@/components/features/profile/AddressesList';
import SecuritySettings from '@/components/features/profile/SecuritySettings';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    firstName: 'Gourav',
    lastName: 'Gupta',
    email: 'gourav.gupta@example.com',
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Lock }
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

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <main className="grow w-full mx-auto mt-8">
        <style>{`
          @media (max-width: 639px) {
            .user-profile-container {
              padding-left: 5px !important;
              padding-right: 5px !important;
            }
          }
          @media (min-width: 640px) and (max-width: 1290px) {
            .user-profile-container {
              padding-left: 5px !important;
              padding-right: 5px !important;
            }
          }
        `}</style>
        <div className="user-profile-container w-full px-4 pt-4 pb-20 lg:px-16 lg:py-16" style={{ padding: '10px' }}>
          <div className="mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-4 sm:mb-6 text-gray-700 transition-colors cursor-pointer hover:text-gray-900"
              style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 500, marginBottom: '1.5rem' }}
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              
            </button>

            {/* Header Section */}
            <div className="p-4 mb-6 shadow-lg bg-linear-to-r from-teal-400 to-cyan-400 rounded-2xl md:p-8" style={{ padding: '10px' }}>
              <ProfileHeader profileData={profileData} />
              <ProfileStats stats={stats} />
            </div>

            {/* Tabs */}
            <ProfileTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
              <PersonalInfoForm
                profileData={profileData}
                tempData={tempData}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setTempData={setTempData}
                handleEdit={handleEdit}
                handleSave={handleSave}
                handleCancel={handleCancel}
                handleInputChange={handleInputChange}
              />
            )}

            {/* Orders Tab Content */}
            {activeTab === 'orders' && <OrdersList />}

            {/* Addresses Tab Content */}
            {activeTab === 'addresses' && <AddressesList />}

            {/* Security Tab Content */}
            {activeTab === 'security' && <SecuritySettings />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserProfile;
