import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu, LogOut, Settings, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import useAdminStore from '../../context/useAdminStore';

const AdminHeader = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const logout = useAdminStore((state) => state.logout);

  return (
    <header className="sticky top-0 z-30 flex h-12 sm:h-14 md:h-16 items-center gap-x-1 sm:gap-x-2 md:gap-x-4 border-b-2 border-emerald-200/70 bg-white/90 backdrop-blur-xl px-1 sm:px-2 md:px-4 shadow-md shadow-emerald-500/10 lg:px-8 transition-all" style={{ background: 'linear-gradient(to right, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)', padding: '0px 10px' }}>
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 via-teal-50/30 to-emerald-100/20 pointer-events-none" />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 relative z-10 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" 
        onClick={onMobileMenuToggle}
      >
        <Menu className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        <span className="sr-only">Open sidebar</span>
      </Button>
      {/* Go to Website Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className=" sm:flex items-center gap-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/50"
            style={{ padding: '0 8px', height: '32px' }}
          >
            <span className=" sm:block text-[10px] sm:text-lg font-medium" style={{marginTop:'3px'}}>DS Pharma</span>
            <ExternalLink className=" hidden md:block h-2.5 w-2.5 sm:h-4 sm:w-4 md:h-5" />
          </Button>

      <div className="flex flex-1 gap-x-2 sm:gap-x-4 self-stretch items-center lg:gap-x-6 relative z-10 justify-end">

        {/* Search - Hidden on mobile, visible on sm and up */}
        <form className="relative hidden sm:flex w-full max-w-md" action="#" method="GET" style={{ padding: '5px' }} >
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full" style={{ paddingLeft: '10px' }}>
            <Search className="pointer-events-none absolute right-2 top-1/2 h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 -translate-y-1/2 text-emerald-600" aria-hidden="true"/>
             <Input 
                id="search-field"
                className="pl-6 sm:pl-8 md:pl-10 text-[10px] sm:text-[8px] sm:text-xs md:text-sm border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 h-7 sm:h-8 md:h-10" 
                style={{ background: 'linear-gradient(to right, #f0fdf4, #ecfdf5)', borderRadius: '10px', padding: '5px 10px' }}
                placeholder="Search..."
                name="search"
                type="search"
             />
          </div>
        </form>
        
        <div className="flex items-center gap-x-1 sm:gap-x-2 lg:gap-x-4">
          {/* Notification Bell - Hidden on xs, visible on sm and up */}
          <button className="hidden sm:flex relative p-1 sm:p-1.5 md:p-2.5 text-emerald-600 hover:text-emerald-700 rounded-lg transition-all duration-200" style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', border: '1px solid #d1fae5', padding: '5px' }}>
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" aria-hidden="true" />
            <span className="absolute top-0 right-0 sm:top-1 sm:right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full ring-2 ring-white animate-pulse shadow-lg shadow-red-500/50" />
            <span className="sr-only">View notifications</span>
          </button>

          {/* Separator - Hidden on mobile */}
          <div className="hidden lg:block h-6 w-px bg-linear-to-b from-transparent via-emerald-300 to-transparent" aria-hidden="true" />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-0.5 sm:gap-x-1 md:gap-x-2 p-0.5 sm:p-1 md:p-2 outline-none rounded-lg transition-all duration-200" style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', border: '1px solid #d1fae5', padding: '3px 6px' }}>
                <div className="flex items-center gap-x-0.5 sm:gap-x-1 md:gap-x-2 cursor-pointer">
                    <Avatar 
                        className="h-8 w-10 sm:h-8 sm:w-10 md:h-8 md:w-10 text-white ring-2 ring-emerald-200 shadow-lg shadow-emerald-500/30"
                        style={{ background: 'linear-gradient(to bottom right, #10b981, #0d9488)' }}
                        fallback="AD"
                    />
                    <span className="hidden md:flex md:items-center">
                        <span className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent" aria-hidden="true">
                          Admin User
                        </span>
                    </span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 sm:w-36 md:w-39 bg-white/95 backdrop-blur-xl border-emerald-100 shadow-xl shadow-emerald-500/10" style={{ padding: '4px 8px' }}>
                <DropdownMenuLabel className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm text-emerald-900">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-emerald-100" />
                <DropdownMenuItem className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm hover:bg-emerald-50 focus:bg-emerald-50 cursor-pointer" style={{ padding: '4px 0px' }}>
                    <User className="mr-1 sm:mr-2 h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-emerald-600"  /> <span style={{ marginTop: '3px' }}>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-emerald-100" />
                <DropdownMenuItem onClick={logout} className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm text-red-600 focus:text-red-700 focus:bg-red-50 hover:bg-red-50 cursor-pointer" style={{ padding: '4px 0px' }}>
                    <LogOut className="mr-1 sm:mr-2 h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" /> <span style={{ marginTop: '2px sm:3px' }}>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
