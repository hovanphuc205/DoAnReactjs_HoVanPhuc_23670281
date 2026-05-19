import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, Lock, User, ArrowLeft, Info } from 'lucide-react';
import { mockUsers } from '../mocks/data';
import loginBg from '../assets/images/login_bg.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const user = await response.json();
        const mappedUser = {
          ...user,
          userName: user.tenDangNhap,
          tenNhanVien: user.tenDangNhap,
          chucVu: 'Quản lý'
        };
        localStorage.setItem('currentUser', JSON.stringify(mappedUser));
        navigate('/manager');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Đăng nhập thất bại!');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.warn('Lỗi kết nối máy chủ, kiểm tra tài khoản giả lập...', err);
      const localUser = mockUsers.find(u => u.tenDangNhap === username && u.matKhau === password);
      if (localUser) {
        const mappedUser = {
          ...localUser,
          userName: localUser.tenDangNhap,
          tenNhanVien: localUser.tenNhanVien || localUser.tenDangNhap,
          chucVu: 'Quản lý'
        };
        localStorage.setItem('currentUser', JSON.stringify(mappedUser));
        navigate('/manager');
      } else {
        setError('Sai tên đăng nhập hoặc mật khẩu!');
        setTimeout(() => setError(''), 3000);
      }
    }
  };


  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Left side - Image & Branding */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img 
          src={loginBg} 
          alt="Coffee background" 
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <Link to="/" className="flex items-center space-x-3 group w-max">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Coffee className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">
              Coffee<span className="text-primary-light text-yellow-400">Space</span>
            </span>
          </Link>

          <div className="max-w-md animate-fade-in-up">
            <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
              Khởi đầu ngày mới bằng cảm hứng.
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Hệ thống quản lý thông minh giúp bạn tối ưu hóa quy trình phục vụ và mang lại trải nghiệm tuyệt vời cho khách hàng.
            </p>
          </div>

          <p className="text-gray-400 text-sm">
            &copy; 2026 CoffeeSpace Team. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 md:p-16 bg-gray-50/50">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center text-sm font-semibold text-gray-400 hover:text-primary transition-colors mb-8 group">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Quay lại trang chủ
            </Link>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Đăng nhập</h1>
            <p className="text-gray-500">Vui lòng nhập tài khoản để truy cập hệ thống.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 mb-6 rounded-2xl flex items-center gap-3 animate-shake">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Tên đăng nhập</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-900 font-medium placeholder:text-gray-300 shadow-sm"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-sm font-bold text-gray-700">Mật khẩu</label>
                <button type="button" className="text-xs font-bold text-primary hover:text-secondary transition-colors">Quên mật khẩu?</button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-900 font-medium placeholder:text-gray-300 shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer" />
                <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700 transition-colors">Ghi nhớ đăng nhập</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-primary hover:bg-secondary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transform transition-all active:scale-95 hover:-translate-y-1 flex items-center justify-center"
            >
              Vào hệ thống
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-gray-100 relative">
            <button 
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-xs font-bold mx-auto"
            >
              <Info size={14} /> {showHint ? 'Ẩn tài khoản mẫu' : 'Xem tài khoản mẫu'}
            </button>
            
            {showHint && (
              <div className="mt-4 p-4 bg-gray-100 rounded-2xl text-xs text-gray-500 animate-fade-in text-center">
                  <p className="font-bold text-gray-700 mb-1">Tài khoản Quản trị</p>
                  <p>User: admin | Pass: 123</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
