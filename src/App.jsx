import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from './components/ui/ToastContainer';
import Home from './pages/Home';
import CartDetails from './pages/CartDetails';
import ProductDetails from './pages/ProductDetails';
import Orders from './pages/Orders';
import OrderDetails from "./pages/OrderDetails";
import OrderConfirmation from "./pages/OrderConfirmation";
import CategoryProducts from "./pages/CategoryProducts";
import UserProfile from "./pages/UserProfile";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SearchPage from "./pages/SearchPage";
import AdminRouter from "./admin/AdminRouter";
import Layout from "@/components/layout/Layout.jsx";
import { AnnouncementProvider } from './contexts/AnnouncementContext';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnnouncementProvider>
        <Router>
          <ToastContainer />
          <Routes>
            {/* Public Auth Routes (No Layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRouter />} />
            
            {/* Standalone Routes (No Layout) */}
            <Route path="/profile" element={<UserProfile />} />


            {/* Protected/Main Routes (With Layout) */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<CartDetails />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/category/:categoryName" element={<CategoryProducts />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />

            </Route>

          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </AnnouncementProvider>
    </QueryClientProvider>
  )
}

export default App
