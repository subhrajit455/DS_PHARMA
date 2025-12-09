import React from 'react';
import { User, Camera, LogOut } from 'lucide-react';

const ProfileHeader = ({ profileData, onLogout }) => {
    return (
        <div className="flex flex-row items-center gap-4 md:gap-6" style={{ padding: '5px' }}>
            {/* Profile Picture */}
            <div className="relative">
                <div className="flex items-center justify-center overflow-hidden bg-white rounded-full shadow-xl w-20 h-20 md:w-32 md:h-32">
                    <User className="w-10 h-10 md:w-16 md:h-16" color="#A5E8DC" strokeWidth={1.5} />
                </div>
                <button className="absolute bottom-0 right-0 flex items-center justify-center bg-white rounded-full shadow-lg cursor-pointer w-7 h-7 md:w-10 md:h-10 hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 md:w-5 md:h-5" color="#000000" />
                </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-left" style={{ padding: '5px' }}>
                <h1
                    className="mt-0 text-lg font-bold text-white md:text-3xl md:mt-2.5"
                    style={{
                        fontFamily: 'Gyrotrope',
                    }}
                >
                    {profileData.firstName} {profileData.lastName}
                </h1>
                <p
                    className="mb-2 text-xs text-white/90 md:text-base md:mb-4"
                    style={{
                        fontFamily: 'Gyrotrope',
                    }}
                >
                    {profileData.email}
                </p>
                <div className="flex flex-wrap gap-2 justify-start" style={{ padding: '5px 0' }}>
                    <span className="px-2 py-0.5 text-xs font-medium text-white rounded-full bg-white/20 backdrop-blur-sm md:px-4 md:py-1 md:text-sm" style={{ padding: '2px 10px' }}>
                        Premium Member
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium text-white rounded-full bg-white/20 backdrop-blur-sm md:px-4 md:py-1 md:text-sm" style={{ padding: '2px 10px' }}>
                        Joined Nov 2024
                    </span>
                </div>
            </div>

            
            {/* Logout Button (Desktop/Mobile) */}
            <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors ml-auto cursor-pointer"
                style={{ fontFamily: 'Gyrotrope' }}
            >
                <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                <span>Logout</span>
            </button>
        </div>
    );
};

export default ProfileHeader;
