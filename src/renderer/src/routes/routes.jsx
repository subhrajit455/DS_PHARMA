import {
  AdminBilling,
  AdminCategories,
  AdminCustomers,
  AdminDashboard,
  AdminIncomingOrders,
  AdminInventory,
  AdminInvoices,
  AdminLayout,
  AdminSettings,
  AdminStockExpiry
} from '@/pages/admin'
import App from '../App'
import {
  StaffLayout,
  StaffDashboard,
  StaffSettings,
  StaffInventory,
  StaffCategories
} from '@/pages/staff'
import NotFound from '@/pages/NotFound'

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          {
            path: 'dashboard',
            element: <AdminDashboard />
          },
          {
            path: 'inventory',
            element: <AdminInventory />
          },
          {
            path: 'settings',
            element: <AdminSettings />
          },
          {
            path: 'categories',
            element: <AdminCategories />
          },
          {
            path: 'billing',
            element: <AdminBilling />
          },
          {
            path: 'billing/:id',
            element: <AdminBilling />
          },
          {
            path: 'customers',
            element: <AdminCustomers />
          },
          {
            path: 'incoming-orders',
            element: <AdminIncomingOrders />
          },
          {
            path: 'invoices',
            element: <AdminInvoices />
          },
          {
            path: 'stock-expiry',
            element: <AdminStockExpiry />
          }
        ]
      },
      {
        path: 'staff',
        element: <StaffLayout />,
        children: [
          {
            path: 'dashboard',
            element: <StaffDashboard />
          },
          {
            path: 'inventory',
            element: <StaffInventory />
          },
          {
            path: 'settings',
            element: <StaffSettings />
          },
          {
            path: 'categories',
            element: <StaffCategories />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]
