import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

// Roles that can access the admin area
const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN']
const STAFF_ROLES = ['STAFF']

function getHomeRoute(role) {
  if (ADMIN_ROLES.includes(role)) return '/admin/dashboard'
  if (STAFF_ROLES.includes(role)) return '/staff/dashboard'
  return '/'
}

/**
 * Protects a route by area ('admin' | 'staff').
 * - If unauthenticated → redirects to /
 * - If wrong area → redirects to the user's correct dashboard
 */
function ProtectedRoute({ children, role: area }) {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/" replace />
  }

  const userRole = user.role

  if (area === 'admin' && !ADMIN_ROLES.includes(userRole)) {
    return <Navigate to={getHomeRoute(userRole)} replace />
  }

  if (area === 'staff' && !STAFF_ROLES.includes(userRole)) {
    return <Navigate to={getHomeRoute(userRole)} replace />
  }

  return children
}

export default ProtectedRoute
