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
import useDataStore from '@/store/useDataStore';
import { USERS } from '@/data/userData';

// Components
import Footer from '@/components/sections/Footer';
import PersonalInfoForm from '@/components/features/profile/PersonalInfoForm';
import AddressesList from '@/components/features/profile/AddressesList';
import OrdersPreview from '@/components/features/profile/OrdersPreview';
import AccountActions from '@/components/features/profile/AccountActions';
import OrdersList from '@/components/features/profile/OrdersList';
import ProfileSidebar from '@/components/features/profile/ProfileSidebar';
import ProfileHeader from '@/components/features/profile/ProfileHeader';

const UserProfile = () => {
    const navigate = useNavigate();
    const { isAuthenticated, currentUser } = useDataStore();
    const [activeSection, setActiveSection] = useState('overview');
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Fetch profile data
    const { data: profileDataResponse, isLoading } = useProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

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
        { id: 'addresses', label: 'Addresses', icon: MapPin, desc: 'Manage locations' },
        { id: 'account', label: 'Settings', icon: Settings, desc: 'Account actions' }
    ];

    if (isLoading) {
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
        <div className="min-h-screen w-full bg-gray-50 font-sans flex flex-col">
            <ProfileHeader profileData={profileData} />

            {/* Main Content Area - flex-1 ensures it takes available space */}
            <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"  style={{ maxWidth: '1280px', margin: '10px auto' }}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <ProfileSidebar 
                        profileData={profileData} 
                        activeSection={activeSection} 
                        setActiveSection={setActiveSection} 
                        sections={sections} 
                    />

                    {/* Right Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <Motion.div
                                key={activeSection}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeSection === 'overview' && (
                                    <div className="space-y-6">
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
                                    <div className="space-y-6">
                                       <OrdersList />
                                    </div>
                                )}
                                
                                {activeSection === 'addresses' && <AddressesList />}
                                {activeSection === 'account' && <AccountActions />}
                            </Motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default UserProfile;
