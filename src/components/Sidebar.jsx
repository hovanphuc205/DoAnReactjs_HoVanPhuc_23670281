import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Coffee, LayoutDashboard, Users, Grid, Receipt, LogOut, Home } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const links = [
    { path: '/manager', icon: <LayoutDashboard size={20} />, label: 'Tổng quan' },
    { path: '/manager/drinks', icon: <Coffee size={20} />, label: 'Đồ uống' },
    { path: '/manager/orders', icon: <Receipt size={20} />, label: 'Đơn hàng' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 flex items-center space-x-3 border-b border-gray-200">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Coffee className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-xs text-gray-500 capitalize">Quản lý</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            end={link.path === '/manager' || link.path === '/staff'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {link.icon}
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <NavLink
          to="/"
          className="flex items-center space-x-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-100 rounded-xl transition-all font-medium"
        >
          <Home size={20} />
          <span>Về trang chủ</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
