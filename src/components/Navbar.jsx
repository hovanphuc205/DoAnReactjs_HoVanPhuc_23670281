import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Coffee, Menu, X, ShoppingBag, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  const transparent = isHome && !isScrolled;

  const links = [
    { to: '/', label: 'Trang chủ', end: true },
    { to: '/menu', label: 'Thực đơn', end: true },
    { to: '/blog', label: 'Blog', end: true },
    { to: '/#about', label: 'Giới thiệu', hash: true },
    { to: '/#contact', label: 'Liên hệ', hash: true },
  ];

  const linkClass = transparent ? 'text-white hover:text-yellow-300' : 'text-gray-700 hover:text-primary';
  const activeLinkClass = transparent ? 'text-yellow-300 font-bold' : 'text-primary font-bold';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      transparent ? 'bg-transparent py-6' : 'bg-white/95 backdrop-blur-md shadow-sm py-4'
    }`}>
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <Coffee className="text-white w-6 h-6" />
          </div>
          <span className={`text-2xl font-bold tracking-tight ${transparent ? 'text-white' : 'text-gray-900'}`}>
            Coffee<span className="text-primary">Space</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map(link => (
            link.hash ? (
              <a key={link.label} href={link.to} className={`font-medium transition-colors ${linkClass}`}>
                {link.label}
              </a>
            ) : (
              <NavLink key={link.label} to={link.to} end={link.end}
                className={({ isActive }) => `font-medium transition-colors ${isActive ? activeLinkClass : linkClass}`}
              >
                {link.label}
              </NavLink>
            )
          ))}
        </div>

        {/* Cart button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 ${
              transparent
                ? 'bg-white/20 text-white backdrop-blur border border-white/30 hover:bg-white/30'
                : 'bg-primary text-white hover:bg-secondary shadow-md shadow-primary/20'
            }`}
            aria-label="Mở giỏ hàng"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 text-gray-900 rounded-full text-xs font-extrabold flex items-center justify-center shadow">
                {itemCount}
              </span>
            )}
          </button>

          {/* Auth button */}
          {currentUser ? (
            <div className="hidden lg:flex items-center gap-4">
              <Link 
                to="/manager"
                className={`flex items-center gap-2 font-bold ${transparent ? 'text-white' : 'text-primary'}`}
              >
                <LayoutDashboard size={18} />
                <span>Hệ thống</span>
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className={`p-2.5 rounded-full transition-all ${
                transparent ? 'text-white hover:bg-white/20' : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Đăng nhập nội bộ"
            >
              <User size={20} />
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${transparent ? 'text-white hover:bg-white/20' : 'text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Mở menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-6 py-4 space-y-3">
          {links.map(link => (
            link.hash ? (
              <a key={link.label} href={link.to}
                className="block py-2 font-medium text-gray-700 hover:text-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <NavLink key={link.label} to={link.to} end={link.end}
                className={({ isActive }) => `block py-2 font-medium transition-colors ${isActive ? 'text-primary font-bold' : 'text-gray-700 hover:text-primary'}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            )
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
