import React from 'react';
import { Search, Bell, User, Menu, LogOut, Settings } from 'lucide-react';
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
  const logout = useAdminStore((state) => state.logout);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b-2 border-emerald-200/70 bg-white/90 backdrop-blur-xl px-4 shadow-md shadow-emerald-500/10 sm:gap-x-6 sm:px-6 lg:px-8 transition-all" style={{ background: 'linear-gradient(to right, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)' }}>
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 via-teal-50/30 to-emerald-100/20 pointer-events-none" />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 relative z-10" 
        onClick={onMobileMenuToggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open sidebar</span>
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch items-center lg:gap-x-6 relative z-10 justify-end" style={{ marginRight: '15px' }}>

        <form className="relative flex w-full max-w-md" action="#" method="GET" style={{ padding: '10px' }} >
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full" style={{ paddingLeft: '15px' }}>
            <Search className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" aria-hidden="true"/>
             <Input 
                id="search-field"
                className="pl-10 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" 
                style={{ background: 'linear-gradient(to right, #f0fdf4, #ecfdf5)', borderRadius: '10px', padding: '10px' }}
                placeholder="Search..."
                name="search"
                type="search"
             />
          </div>
        </form>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button className="relative p-2.5 text-emerald-600 hover:text-emerald-700 rounded-lg transition-all duration-200" style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', border: '1px solid #d1fae5', padding: '10px' }}>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full ring-2 ring-white animate-pulse shadow-lg shadow-red-500/50" />
            <span className="sr-only">View notifications</span>
          </button>

          {/* Separator with gradient */}
          <div className="hidden lg:block h-6 w-px bg-gradient-to-b from-transparent via-emerald-300 to-transparent" aria-hidden="true" />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-2 p-2 outline-none rounded-lg transition-all duration-200" style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', border: '1px solid #d1fae5', padding: '5px 10px' }}>
                <div className="flex items-center gap-x-2 cursor-pointer">
                    <Avatar 
                        className="h-9 w-9 text-white ring-2 ring-emerald-200 shadow-lg shadow-emerald-500/30"
                        style={{ background: 'linear-gradient(to bottom right, #10b981, #0d9488)' }}
                        fallback="AD"
                    />
                    <span className="hidden lg:flex lg:items-center">
                        <span className="text-sm font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent" aria-hidden="true">
                          Admin User
                        </span>
                    </span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-39 bg-white/95 backdrop-blur-xl border-emerald-100 shadow-xl shadow-emerald-500/10" style={{ padding: '5px 10px' }}>
                <DropdownMenuLabel className="text-emerald-900">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-emerald-100" />
                <DropdownMenuItem className="hover:bg-emerald-50 focus:bg-emerald-50 cursor-pointer" style={{ padding: '5px 0px' }}>
                    <User className="mr-2 h-4 w-4 text-emerald-600"  /> <span style={{ marginTop: '5px' }}>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-emerald-100" />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700 focus:bg-red-50 hover:bg-red-50 cursor-pointer" style={{ padding: '5px 0px' }}>
                    <LogOut className="mr-2 h-4 w-4" /> <span style={{ marginTop: '3px' }}>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
