import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import AdminLogin from './pages/Login/AdminLogin';
import Dashboard from './pages/Dashboard/Dashboard';
import ProductsList from './pages/Products/ProductsList';
import ProductForm from './pages/Products/ProductForm';
import ProductDetails from './pages/Products/ProductDetails';
import OrdersList from './pages/Orders/OrdersList';
import OrderDetails from './pages/Orders/OrderDetails';
import CustomersList from './pages/Customers/CustomersList';
import CustomerDetails from './pages/Customers/CustomerDetails';

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Products */}
        <Route path="products" element={<ProductsList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        
        {/* Orders */}
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        
        {/* Customers */}
        <Route path="customers" element={<CustomersList />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRouter;
