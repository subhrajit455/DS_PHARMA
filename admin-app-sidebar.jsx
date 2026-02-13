import { ClipboardList, Home, Layers, LogOut, Package, Settings, Users } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'

import { syncApi } from '@/api'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineCloudSync } from 'react-icons/ai'
import { BiAlarm } from 'react-icons/bi'
import { LiaFileInvoiceSolid } from 'react-icons/lia'
import { VscGraphLine } from 'react-icons/vsc'

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: Home
  },
  {
    title: 'Categories',
    url: '/admin/categories',
    icon: Layers
  },
  {
    title: 'Customers',
    url: '/admin/customers',
    icon: Users
  },
  {
    title: 'Staff',
    url: '/admin/staff',
    icon: Users
  },
  {
    title: 'Inventory',
    url: '/admin/inventory',
    icon: Package
  },
  {
    title: 'Billing',
    url: '/admin/billing',
    icon: ClipboardList
  },
  {
    title: 'E-commerce Orders',
    url: '/admin/ecommerce-orders',
    icon: BiAlarm
  },
  {
    title: 'Invoices',
    url: '/admin/invoices',
    icon: LiaFileInvoiceSolid
  },
  {
    title: 'Reports',
    url: '/admin/reports',
    icon: VscGraphLine
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings
  }
]

export function AdminAppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const [syncing, setSyncing] = useState(false)

  const syncMasterData = async () => {
    setSyncing(true)
    toast.loading('Syncing data...')
    try {
      const response = await syncApi.syncMasterData()
      console.log(response)

      if (response.success) {
        localStorage.setItem('lastSyncAt', JSON.stringify(response.data.DateTime))
        toast.dismiss()
        toast.success('Data synced successfully')
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to sync data')
    } finally {
      setSyncing(false)
    }
  }

  const handleLogout = async () => {
    navigate('/')

    // try {
    //   const response = await authApi.logout()

    //   if (response.success) {
    //     localStorage.removeItem('user')
    //     toast.success('Logged out successfully')
    //     navigate('/login')
    //   }
    // } catch (error) {
    //   toast.error(error || 'Failed to logout')
    // }
  }

  return (
    <Sidebar className="border-0">
      <SidebarHeader className="h-16 border-b border-gray-200 p-0">
        <SidebarGroupLabel className="h-full text-xl font-medium text-sidebar-foreground flex items-center justify-center">
          Admin Panel
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => {
                const isActive = location.pathname.split('/')[2] === item.url.split('/')[2]

                const colors = [
                  'from-pink-400 to-pink-600',
                  'from-yellow-200 to-yellow-400',
                  'from-green-300 to-green-500',
                  'from-indigo-400 to-indigo-600',
                  'from-purple-400 to-purple-600',
                  'from-rose-400 to-rose-600',
                  'from-amber-300 to-amber-500',
                  'from-sky-300 to-sky-500',
                  'from-teal-300 to-teal-500',
                  'from-violet-300 to-violet-500'
                ]
                const color = colors[index % colors.length]

                return (
                  <SidebarMenuItem key={item.title} className="relative">
                                        
                    {isActive && (
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-9 w-1 rounded-r-md bg-linear-to-b ${color}`}
                      />
                    )}
                                        
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                            
                      <Link to={item.url} className="flex items-center">
                        <span
                          className={`inline-flex items-center justify-center size-7 rounded-md bg-linear-to-tr ${color} text-white mr-3 shadow-sm`}
                        >
                          <item.icon className="size-4" />
                        </span>
                        <span
                          className={
                            isActive
                              ? 'font-semibold text-sidebar-foreground'
                              : 'text-sidebar-foreground/90'
                          }
                        >
                          {item.title}
                        </span>
                        {item.badge && (
                          <SidebarMenuBadge className="ml-auto">{item.badge}</SidebarMenuBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <p className="text-xs text-sidebar-foreground/50">
                Last Sync : {JSON.parse(localStorage.getItem('lastSyncAt'))}
              </p>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button
                  onClick={syncMasterData}
                  disabled={syncing}
                  className="bg-blue-600 hover:bg-blue-700 rounded-none"
                >
                  <AiOutlineCloudSync />
                  {syncing ? 'Syncing...' : 'Sync Data'}
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Button
                  variant="destructive"
                  className="rounded-none hover:bg-red-700"
                  onClick={handleLogout}
                >
                  <LogOut />
                  <span>Logout</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  )
}
