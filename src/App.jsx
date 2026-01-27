import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from './shared/components/ui/ToastContainer';
import Layout from "@/user/components/layout/Layout.jsx";
import ScrollToTop from "@/shared/components/ScrollToTop";
import { AnnouncementProvider } from '@/shared/contexts/AnnouncementContext';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import PageLoader from './shared/components/loaders/PageLoader';

// Lazy load all page components
const Home = lazy(() => import('./user/pages/Home'));
const CartDetails = lazy(() => import('./user/pages/CartDetails'));
const ProductDetails = lazy(() => import('./user/pages/ProductDetails'));
const Orders = lazy(() => import('./user/pages/Orders'));
const OrderDetails = lazy(() => import("./user/pages/OrderDetails"));
const OrderConfirmation = lazy(() => import("./user/pages/OrderConfirmation"));
const CategoryProducts = lazy(() => import("./user/pages/CategoryProducts"));
const UserProfile = lazy(() => import("./user/pages/UserProfile"));
const LoginPage = lazy(() => import("./user/pages/LoginPage"));
const SignupPage = lazy(() => import("./user/pages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("./user/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./user/pages/ResetPasswordPage"));
const SearchPage = lazy(() => import("./user/pages/SearchPage"));
const FeaturedProductsPage = lazy(() => import("./user/pages/FeaturedProductsPage"));
const AllProductsPage = lazy(() => import("./user/pages/AllProductsPage"));
const NotFoundPage = lazy(() => import("./user/pages/NotFoundPage"));
const AdminRouter = lazy(() => import("./admin/AdminRouter"));

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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AnnouncementProvider>
          <Router>
            <ScrollToTop />
            <ToastContainer />
            <Suspense fallback={<PageLoader />}>
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
                  <Route path="/category/:categoryId" element={<CategoryProducts />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                  <Route path="/featured" element={<FeaturedProductsPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/shop" element={<AllProductsPage />} />
                  <Route path="/profile" element={<UserProfile />} />

                </Route>

                {/* 404 - Not Found Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Router>
          <ReactQueryDevtools initialIsOpen={false} />
        </AnnouncementProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
