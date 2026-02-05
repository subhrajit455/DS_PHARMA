import { AdminAppSidebar } from '@/components/admin-app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Outlet } from 'react-router'

export default function Layout() {
  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <main className="w-full overflow-y-auto bg-[#f4f4f5]">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
