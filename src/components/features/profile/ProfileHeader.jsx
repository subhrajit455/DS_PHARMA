import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ profileData }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm w-full">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" style={{ maxWidth: '1280px', margin: 'auto' }}>
                <div className="flex items-center gap-4" style={{ padding: '10px'}}>
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded text-gray-600"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">My Account</h1>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                        {profileData.firstName?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                        {profileData.firstName} {profileData.lastName}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
