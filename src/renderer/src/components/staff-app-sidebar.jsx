import { authApi, syncApi } from '@/api'
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
import { ClipboardList, Home, Layers, LogOut, Pill, Settings, Users } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineCloudSync } from 'react-icons/ai'
import { BiAlarm } from 'react-icons/bi'
import { LiaFileInvoiceSolid } from 'react-icons/lia'
import { Link, useLocation, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/features/authSlice'

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/staff/dashboard',
    icon: Home
  },
  {
    title: 'Inventory',
    url: '/staff/inventory',
    icon: Pill
  },
  {
    title: 'Customers',
    url: '/staff/customers',
    icon: Users
  },
  {
    title: 'Categories',
    url: '/staff/categories',
    icon: Layers
  },
  {
    title: 'Billing',
    url: '/staff/billing',
    icon: ClipboardList
  },
  {
    title: 'Invoices',
    url: '/staff/invoices',
    icon: LiaFileInvoiceSolid
  }
]

export function StaffAppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
    // Always clear local state immediately — don't wait for API
    localStorage.removeItem('token')
    localStorage.removeItem('salerId')
    localStorage.removeItem('role')
    dispatch(logout())
    navigate('/')

    // Best-effort server-side session invalidation
    try {
      await authApi.logout()
      toast.success('Logged out successfully')
    } catch (error) {
      // Already logged out locally, silently ignore
    }
  }

  return (
    <Sidebar className="border-0">
      <SidebarHeader className="p-2 border-b">
        <SidebarGroupLabel className="text-xl font-medium text-sidebar-foreground">
          💊 Staff Panel
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
                  'from-sky-300 to-sky-500'
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
            <SidebarMenuItem></SidebarMenuItem>
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
