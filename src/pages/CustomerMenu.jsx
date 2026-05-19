import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { mockDrinks } from '../mocks/data';
import { Star, Search, ShoppingBag, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

import blackCoffeeImg from '../assets/images/black_coffee.png';
import milkCoffeeImg from '../assets/images/milk_coffee.png';
import peachTeaImg from '../assets/images/peach_tea.png';

const getDrinkImage = (name) => {
  const n = name.toLowerCase();
  if (n.includes('sữa') || n.includes('bạc xỉu')) return milkCoffeeImg;
  if (n.includes('trà') || n.includes('đào') || n.includes('sen')) return peachTeaImg;
  return blackCoffeeImg;
};

const DrinkCard = ({ drink, index }) => {
  const { addToCart, cart, startBuyNow } = useCart();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = cart.find(i => i.maDoUong === drink.maDoUong);

  const handleAdd = () => {
    addToCart(drink);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    startBuyNow(drink);
    navigate('/checkout');
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group flex flex-col">
      <div className="h-52 overflow-hidden relative shrink-0">
        <img
          src={drink.hinhAnh || getDrinkImage(drink.tenDoUong)}
          alt={drink.tenDoUong}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {drink.trangThai === 'Hết hàng' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-red-500 px-4 py-1 rounded-full">Hết hàng</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-yellow-600 flex items-center shadow">
          <Star className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-400 mr-1" /> 4.9
        </div>
        {inCart && (
          <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
            <Check size={11} /> {inCart.soLuong} trong giỏ
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{drink.tenDoUong}</h3>
          <span className="text-xl font-extrabold text-primary shrink-0 ml-2">{drink.donGia.toLocaleString()}đ</span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed flex-1">
          Hương vị đậm đà, được pha chế từ 100% hạt Arabica thượng hạng, phù hợp cho mọi buổi sáng.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            onClick={handleAdd}
            disabled={drink.trangThai === 'Hết hàng'}
            className={`flex-1 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed border-2 ${
              justAdded
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-100 text-gray-600 hover:border-primary hover:text-primary'
            }`}
            title="Thêm vào giỏ hàng"
          >
            {justAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={drink.trangThai === 'Hết hàng'}
            className="flex-[2] py-3 bg-primary text-white rounded-2xl font-bold hover:bg-secondary transition-all transform hover:-translate-y-0.5 shadow-md shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomerMenu = () => {
  const [drinks, setDrinks] = useState([]);

  React.useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/drinks');
        if (response.ok) {
          const data = await response.json();
          // Map API data structure
          const formattedData = data.map(d => ({
            ...d,
            donGia: parseFloat(d.giaTien || 0),
            trangThai: 'Còn hàng', // Mặc định từ API chưa có field này
            hinhAnh: d.hinhAnh ? (d.hinhAnh.startsWith('data:image') ? d.hinhAnh : `data:image/png;base64,${d.hinhAnh}`) : null
          }));
          setDrinks(formattedData);
        } else {
          console.warn('Dùng dữ liệu giả vì lỗi API:', response.status);
          let localDrinks = JSON.parse(localStorage.getItem('mockDrinks') || '[]');
          if (localDrinks.length === 0) {
            localDrinks = mockDrinks;
            localStorage.setItem('mockDrinks', JSON.stringify(localDrinks));
          }
          setDrinks(localDrinks);
        }
      } catch (err) {
        console.warn('Lỗi kết nối máy chủ, dùng dữ liệu giả...', err);
        let localDrinks = JSON.parse(localStorage.getItem('mockDrinks') || '[]');
        if (localDrinks.length === 0) {
          localDrinks = mockDrinks;
          localStorage.setItem('mockDrinks', JSON.stringify(localDrinks));
        }
        setDrinks(localDrinks);
      }
    };
    fetchDrinks();
  }, []);
  const [search, setSearch] = useState('');
  const filtered = drinks.filter(d =>
    d.tenDoUong.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans" style={{ background: '#FAFAF7' }}>
      <Navbar />
      <CartDrawer />

      {/* Page header */}
      <div className="pt-32 pb-16 text-center" style={{ background: 'linear-gradient(135deg, #6F4E37 0%, #A67B5B 100%)' }}>
        <p className="text-yellow-300 font-semibold uppercase tracking-[0.2em] text-sm mb-3">✦ CoffeeSpace</p>
        <h1 className="text-5xl font-extrabold text-white mb-4">Thực đơn của chúng tôi</h1>
        <p className="text-white/70 text-lg max-w-md mx-auto">
          Chọn món yêu thích và đặt hàng trực tuyến — nhanh chóng, tiện lợi
        </p>
      </div>

      {/* Sticky search */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 px-6 shadow-sm">
        <div className="container mx-auto max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm thức uống..."
            className="w-full pl-12 pr-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <p className="text-gray-400 text-sm mb-8">{filtered.length} loại thức uống</p>
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">☕</p>
            <p className="text-xl font-semibold">Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((drink, index) => (
              <DrinkCard key={drink.maDoUong} drink={drink} index={index} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CustomerMenu;
