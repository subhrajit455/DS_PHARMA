import React, { useState, useEffect } from 'react';
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
import { useProfile, useUpdateProfile } from '@/hooks/queries/useProfile';
import { useAuthStore } from '@/store/useAuthStore';

import { USERS } from '@/data/userData';

const UserProfile = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch profile data
  const { data: profileDataResponse, isLoading } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  // Mock data as fallback
  const mockProfileData = USERS[0];

  const profileData = profileDataResponse?.data || mockProfileData;

  const [tempData, setTempData] = useState({ ...profileData });

  // Update tempData when profileData changes (e.g. after fetch)
  useEffect(() => {
    if (profileData) {
      setTempData({ ...profileData });
    }
  }, [profileData]);

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
    updateProfile(tempData, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <main className="grow w-full max-w-7xl mx-auto mt-8"
      style={{ width: '100%', maxWidth: '1280px', margin: '0 auto' }}
      >
        <style>{`
          @media (max-width: 639px) {
            .user-profile-container {
              padding-left: 5px !important;
              padding-right: 5px !important;
              padding-bottom: 80px !important;
            }
          }
          @media (min-width: 640px) and (max-width: 1290px) {
            .user-profile-container {
              padding-left: 5px !important;
              padding-right: 5px !important;
            }
          }
        `}</style>
        <div className="user-profile-container w-full min-h-[800px] px-4 pt-4 pb-20 lg:px-16 lg:py-16" style={{ padding: '10px' }}>
          <div className="mx-auto ">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="sm:hidden flex items-center gap-2 mb-4 sm:mb-6 text-gray-700 transition-colors cursor-pointer hover:text-gray-900"
              style={{ fontFamily: 'Gyrotrope', fontSize: '14px', fontWeight: 500, marginBottom: '1.5rem' }}
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              
            </button>

            {/* Header Section */}
            <div className="p-4 mb-6 shadow-lg bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl md:p-8" style={{ padding: '10px' }}>
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
                isSaving={isUpdating}
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
