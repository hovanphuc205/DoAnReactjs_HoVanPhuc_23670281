import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Coffee className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Coffee<span className="text-primary">Space</span>
            </span>
          </div>
          <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
            Chúng tôi tin rằng mỗi tách cà phê là một câu chuyện. Hãy đến và trải nghiệm không gian hiện đại, nơi hương vị tuyệt hảo hòa quyện cùng sự tận tâm.
          </p>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-white">Liên hệ</h4>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3 text-gray-400">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span>123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-400">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <span>0784589141</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-400">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <span>hovanphuc9141@gmail.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-white">Giờ mở cửa</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex justify-between border-b border-gray-800 pb-2">
              <span>Thứ 2 - Thứ 6</span>
              <span className="font-medium text-white">07:00 - 22:00</span>
            </li>
            <li className="flex justify-between border-b border-gray-800 pb-2">
              <span>Thứ 7 - CN</span>
              <span className="font-medium text-white">08:00 - 23:00</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} CoffeeSpace. All rights reserved.</p>
        <Link to="/login" className="text-gray-700 hover:text-gray-400 transition-colors text-xs">
          Đăng nhập nội bộ
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
