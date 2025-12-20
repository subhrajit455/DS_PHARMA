import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Settings,
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

// Hooks & Store
import { useProfile, useUpdateProfile } from '@/hooks/queries/useProfile';
import { useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/queries/useAddresses';
import useDataStore from '@/store/useDataStore';
import { USERS } from '@/data/userData';

// Components
import PersonalInfoForm from '@/components/features/profile/PersonalInfoForm';
import AddressesList from '@/components/features/profile/AddressesList';
import OrdersPreview from '@/components/features/profile/OrdersPreview';
import AccountActions from '@/components/features/profile/AccountActions';
import OrdersList from '@/components/features/profile/OrdersList';
import ProfileSidebar from '@/components/features/profile/ProfileSidebar';
import WishlistSection from '@/components/features/profile/WishlistSection';
import { Heart } from 'lucide-react';

const UserProfile = () => {
    const navigate = useNavigate();
    const { isAuthenticated, currentUser } = useDataStore();
    const [activeSection, setActiveSection] = useState('overview');
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            // Debounce redirect to allow logout action (which navigates to /) to complete
            // This prevents race conditions where logout -> state clear -> redirect to /login happens
            // instead of logout -> redirect to /
            const timer = setTimeout(() => {
                navigate('/login', { replace: true });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, navigate]);

    // Fetch profile data
    const { data: profileDataResponse, isLoading } = useProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

    // Fetch addresses at parent level to prevent reload on section switch
    const { data: addressesData, isLoading: isLoadingAddresses } = useAddresses();
    const { mutate: addAddress, isPending: isAddingAddress } = useAddAddress();
    const { mutate: updateAddress, isPending: isUpdatingAddress } = useUpdateAddress();
    const { mutate: deleteAddress, isPending: isDeletingAddress } = useDeleteAddress();

    // Dynamic profile data with fallback
    const [profileData, setProfileData] = useState(currentUser || USERS[0]);
    const [tempProfileData, setTempProfileData] = useState({});

    // Sync profile data
    useEffect(() => {
        if (currentUser) {
            setProfileData(currentUser);
            setTempProfileData(currentUser);
        } else if (profileDataResponse?.data) {
            setProfileData(profileDataResponse.data);
            setTempProfileData(profileDataResponse.data);
        }
    }, [currentUser, profileDataResponse]);

    // Profile handlers
    const handleEditProfile = () => {
        setIsEditingProfile(true);
        setTempProfileData({ ...profileData });
    };

    const handleSaveProfile = () => {
        updateProfile(tempProfileData, {
            onSuccess: () => {
                setProfileData(tempProfileData);
                setIsEditingProfile(false);
            }
        });
    };

    const handleCancelProfile = () => {
        setTempProfileData({ ...profileData });
        setIsEditingProfile(false);
    };

    const handleProfileChange = (field, value) => {
        setTempProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const sections = [
        { id: 'overview', label: 'Overview', icon: User, desc: 'Personal details' },
        { id: 'orders', label: 'Orders', icon: ShoppingBag, desc: 'Track & Buy again' },
        { id: 'wishlist', label: 'Wishlist', icon: Heart, desc: 'Saved for later' },
        { id: 'addresses', label: 'Addresses', icon: MapPin, desc: 'Manage locations' },
        { id: 'account', label: 'Settings', icon: Settings, desc: 'Account actions' }
    ];

    if (isLoading || isLoadingAddresses) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page-wrapper min-h-screen w-full bg-gray-50 font-sans flex flex-col">
            <style>{`
                .profile-page-wrapper {
                    padding-top: 60px;
                }
                @media (min-width: 768px) {
                    .profile-page-wrapper {
                        padding-top: 80px !important;
                    }
                }
                @media (max-width: 639px) {
                    .profile-container {
                        padding-left: 5px !important;
                        padding-right: 5px !important;
                    }
                }
            `}</style>
            {/* Main Content Area - flex-1 ensures it takes available space */}
            <main className="profile-container flex-1 w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8" style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">

                    <ProfileSidebar 
                        profileData={profileData} 
                        activeSection={activeSection} 
                        setActiveSection={setActiveSection} 
                        sections={sections} 
                    />

                    {/* Right Content Area with Min-Height for Stability */}
                    <div className="lg:col-span-9">
                        {/* Min-height container prevents layout shifts - Responsive */}
                        <div style={{ 
                            minHeight: window.innerWidth >= 768 
                                ? 'calc(100vh - 320px)'  // Desktop/Tablet
                                : 'calc(100vh - 220px)'   // Mobile - reduced for smaller screens
                        }}>
                            <AnimatePresence mode="wait">
                                <Motion.div
                                    key={activeSection}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeSection === 'overview' && (
                                        <div className="space-y-4 sm:space-y-6">
                                            <PersonalInfoForm
                                                profileData={profileData}
                                                tempData={tempProfileData}
                                                isEditing={isEditingProfile}
                                                handleEdit={handleEditProfile}
                                                handleSave={handleSaveProfile}
                                                handleCancel={handleCancelProfile}
                                                handleInputChange={handleProfileChange}
                                                isSaving={isUpdating}
                                            />
                                            <div className="">
                                                <OrdersPreview />
                                                
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'orders' && (
                                        <div className="space-y-4 sm:space-y-6">
                                           <OrdersList />
                                        </div>
                                    )}
                                    
                                    {activeSection === 'wishlist' && <WishlistSection />}
                                    
                                    {activeSection === 'addresses' && (
                                        <AddressesList 
                                            addressesData={addressesData}
                                            addAddress={addAddress}
                                            updateAddress={updateAddress}
                                            deleteAddress={deleteAddress}
                                            isAddingAddress={isAddingAddress}
                                            isUpdatingAddress={isUpdatingAddress}
                                            isDeletingAddress={isDeletingAddress}
                                        />
                                    )}
                                    {activeSection === 'account' && <AccountActions />}
                                </Motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default UserProfile;
