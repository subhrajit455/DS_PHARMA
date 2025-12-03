import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CartDetails from './pages/CartDetails';
import ProductDetails from './pages/ProductDetails';
import Orders from './pages/Orders';
import OrderDetails from "./pages/OrderDetails";
import UserProfile from "./pages/UserProfile";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Layout from "@/components/layout/Layout.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes (No Layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected/Main Routes (With Layout) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartDetails />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
        </Route>
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  )
}

export default App
