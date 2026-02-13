import {
  AdminBilling,
  AdminCategories,
  AdminCustomers,
  AdminDashboard,
  AdminIncomingOrders,
  AdminInventory,
  AdminInvoices,
  AdminLayout,
  AdminReports,
  AdminSettings,
  AdminStaff,
  AdminStockExpiry
} from '@/pages/admin'
import App from '../App'
import {
  StaffLayout,
  StaffDashboard,
  StaffSettings,
  StaffInventory,
  StaffCategories,
  StaffInvoices,
  StaffBilling,
  StaffCustomers,
  StaffIncomingOrders,
  StaffStockExpiry
} from '@/pages/staff'
import NotFound from '@/pages/NotFound'
import { Login } from '@/pages/auth'

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Login />
      },
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
            path: 'ecommerce-orders',
            element: <AdminIncomingOrders />
          },
          {
            path: 'invoices',
            element: <AdminInvoices />
          },
          {
            path: 'stock-expiry',
            element: <AdminStockExpiry />
          },
          {
            path: 'staff',
            element: <AdminStaff />
          },
          {
            path: 'reports',
            element: <AdminReports />
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
            path: 'customers',
            element: <StaffCustomers />
          },
          {
            path: 'categories',
            element: <StaffCategories />
          },
          {
            path: 'billing',
            element: <StaffBilling />
          },
          {
            path: 'incoming-orders',
            element: <StaffIncomingOrders />
          },
          {
            path: 'incoming-orders',
            element: <StaffIncomingOrders />
          },
          {
            path: 'invoices',
            element: <StaffInvoices />
          },
          {
            path: 'stock-expiry',
            element: <StaffStockExpiry />
          },
          {
            path: 'settings',
            element: <StaffSettings />
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
