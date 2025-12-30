import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from './shared/components/ui/ToastContainer';
import Home from './user/pages/Home';
import CartDetails from './user/pages/CartDetails';
import ProductDetails from './user/pages/ProductDetails';
import Orders from './user/pages/Orders';
import OrderDetails from "./user/pages/OrderDetails";
import OrderConfirmation from "./user/pages/OrderConfirmation";
import CategoryProducts from "./user/pages/CategoryProducts";
import UserProfile from "./user/pages/UserProfile";
import LoginPage from "./user/pages/LoginPage";
import SignupPage from "./user/pages/SignupPage";
import ForgotPasswordPage from "./user/pages/ForgotPasswordPage";
import ResetPasswordPage from "./user/pages/ResetPasswordPage";
import SearchPage from "./user/pages/SearchPage";
import NotFoundPage from "./user/pages/NotFoundPage";
import AdminRouter from "./admin/AdminRouter";
import Layout from "@/user/components/layout/Layout.jsx";
import ScrollToTop from "@/shared/components/ScrollToTop";
import { AnnouncementProvider } from '@/shared/contexts/AnnouncementContext';

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
          <ScrollToTop />
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
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />

            {/* Protected/Main Routes (With Layout) */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<CartDetails />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/category/:categoryName" element={<CategoryProducts />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<UserProfile />} />

            </Route>

            {/* 404 - Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </AnnouncementProvider>
    </QueryClientProvider>
  )
}

export default App
