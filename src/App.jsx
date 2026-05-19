import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import LandingPage from './pages/LandingPage';
import CustomerMenu from './pages/CustomerMenu';
import Blog from './pages/Blog';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen text-gray-900 font-sans" style={{ background: '#FAFAF7' }}>
          <Routes>
            {/* Public / Customer pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu" element={<CustomerMenu />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Admin pages */}
            <Route path="/login" element={<Login />} />
            <Route 
              path="/manager/*" 
              element={
                <ProtectedRoute allowedRoles={['Quản lý']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
