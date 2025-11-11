import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CartDetails from './pages/CartDetails';
import ProductDetails from './pages/ProductDetails';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import UserProfile from './pages/UserProfile';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Layout from './components/layout/Layout';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartDetails />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
