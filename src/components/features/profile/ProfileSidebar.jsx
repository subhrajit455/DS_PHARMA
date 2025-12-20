import React from 'react';
import { User, Camera, ChevronRight, LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/useLogout';

const ProfileSidebar = ({ 
    profileData, 
    activeSection, 
    setActiveSection, 
    sections 
}) => {
    const logout = useLogout();

    const handleLogout = () => {
        logout();
    };

    return (
        <aside className="lg:col-span-3 lg:sticky lg:top-24 self-start space-y-6 md:min-h-[calc(100vh-200px)]" style={{ marginTop: window.innerWidth >= 640 ? '30px' : '0' }}>
            {/* User Mini Profile Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center" style={{ marginBottom: '10px', padding: '5px'}}>
                <div className="relative mb-4 group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                        {profileData.avatar ? (
                            <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-4">{profileData.email}</p>
                <div className="w-full pt-4 border-t border-gray-100 flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-500">Member since</span>
                    <span className="font-medium text-gray-900">2023</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-2 hidden lg:block" style={{ padding: '5px'}}>
                {sections.map((section) => (
                    <button
                        style={{marginBottom: '10px'}}
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all mb-1 ${
                            activeSection === section.id
                                ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <div className="flex items-center gap-3" style={{ padding: '5px'}}>
                            <div className={`p-2 rounded-lg ${
                                activeSection === section.id ? 'bg-white text-emerald-600' : 'bg-gray-100 text-gray-500'
                            }`}>
                                <section.icon className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-xs sm:text-sm">{section.label}</span>
                                <span className="block text-xs opacity-70 font-medium">{section.desc}</span>
                            </div>
                        </div>
                        {activeSection === section.id && <ChevronRight className="w-4 h-4" />}
                    </button>
                ))}

                <div className="mt-2 pt-2 border-t border-gray-100" style={{ padding: '5px 10px', marginTop: '10px'}}>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    >
                    <div className='w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors'>
                        <div className="p-2 rounded-lg bg-red-100 text-red-600">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xs sm:text-sm">Sign Out</span>
                    </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Tabs */}
            <div className="lg:hidden flex overflow-x-auto pb-4 gap-4 no-scrollbar" style={{ padding: '2px 5px'}}>
                {sections.map((section) => (
                    <button
                        style={{padding: '2px 5px'}}
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex-none px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                            activeSection === section.id
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                    >
                        {section.label}
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default ProfileSidebar;
