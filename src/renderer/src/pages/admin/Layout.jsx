import { AdminAppSidebar } from '@/components/admin-app-sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Bell, LogOut, Search, Settings, User } from 'lucide-react'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import Logo from '@/assets/logo.png'

export default function Layout() {
  const navigate = useNavigate()
  const [notifications] = useState(3) // Example notification count

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <main className="w-full h-screen flex flex-col bg-[#f4f4f5]">
        {/* Fixed Top Bar */}
        <div className="h-16 shadow-md bg-white flex items-center justify-between px-6 py-2 shrink-0 sticky top-0 z-10">
          <img src={Logo} alt="Logo" className="h-14" />

          <div className="relative w-3xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products, customers, orders..."
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start py-3">
                  <div className="font-medium">Low Stock Alert</div>
                  <div className="text-sm text-muted-foreground">
                    5 products are running low on stock
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start py-3">
                  <div className="font-medium">New Order Received</div>
                  <div className="text-sm text-muted-foreground">Order #12345 from e-commerce</div>
                  <div className="text-xs text-muted-foreground mt-1">5 hours ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start py-3">
                  <div className="font-medium">Products Expiring Soon</div>
                  <div className="text-sm text-muted-foreground">3 products expiring in 7 days</div>
                  <div className="text-xs text-muted-foreground mt-1">1 day ago</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">Admin User</span>
                    <span className="text-xs text-muted-foreground">admin@example.com</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
