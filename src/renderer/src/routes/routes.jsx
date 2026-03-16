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
  AdminStaffDetails,
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
import ProtectedRoute from '@/components/ProtectedRoute'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

// Redirect already-logged-in users away from the login page
function GuestRoute({ children }) {
  const { user } = useSelector((state) => state.auth)
  if (user) {
    const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(user.role)
    const redirect = isAdmin ? '/admin/dashboard' : '/staff/dashboard'
    return <Navigate to={redirect} replace />
  }
  return children
}

export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: (
          // <GuestRoute>
            <Login />
          // </GuestRoute>
        )
      },
      {
        path: 'admin',
        element: (
          // <ProtectedRoute role="admin">
            <AdminLayout />
          // </ProtectedRoute>
        ),
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
            path: 'staff/:staffId',
            element: <AdminStaffDetails />
          },
          {
            path: 'reports',
            element: <AdminReports />
          }
        ]
      },
      {
        path: 'staff',
        element: (
          // <ProtectedRoute role="staff">
            <StaffLayout />
          // </ProtectedRoute>
        ),
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
