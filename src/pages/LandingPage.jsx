import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { mockDrinks } from '../mocks/data';
import { useCart } from '../context/CartContext';
import { ArrowRight, Star, Clock, Award, Leaf, Phone, MapPin, Mail, ShoppingBag, Check } from 'lucide-react';

// Custom hook for scroll animation
const useScrollFade = () => {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('visible');
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
};

const DRINK_IMAGES = [
  'https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1578160112054-954a67602b88?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=500&q=80',
];

const DrinkCard = ({ drink, index }) => {
  const { addToCart, startBuyNow } = useCart();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);
  const ref = useScrollFade();

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
    <div
      ref={ref}
      className="section-fade bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100 flex flex-col h-full"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="h-48 rounded-2xl bg-gray-100 mb-6 overflow-hidden relative shrink-0">
        <img
          src={drink.hinhAnh || DRINK_IMAGES[index % DRINK_IMAGES.length]}
          alt={drink.tenDoUong}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-yellow-600 flex items-center shadow-sm">
          <Star className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-400 mr-1" /> 4.9
        </div>
        {drink.trangThai === 'Hết hàng' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
            <span className="text-white font-bold text-lg">Hết hàng</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-xl font-bold text-gray-900">{drink.tenDoUong}</h4>
        <span className="text-lg font-extrabold text-primary shrink-0 ml-2">{drink.donGia.toLocaleString()}đ</span>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
        Hương vị đậm đà, được pha chế từ 100% hạt Arabica thượng hạng, phù hợp cho mọi buổi sáng.
      </p>
      <div className="mt-6 flex gap-2">
        <button
          onClick={handleAdd}
          disabled={drink.trangThai === 'Hết hàng'}
          className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
            justAdded
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-primary/20 text-primary hover:bg-primary/5'
          }`}
          title="Thêm vào giỏ"
        >
          {justAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={drink.trangThai === 'Hết hàng'}
          className="flex-[2] py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
};

const DEFAULT_FEATURED = [
  { maDoUong: 'CF001', tenDoUong: 'Cà phê sữa đá', donGia: 30000, trangThai: 'Còn hàng' },
  { maDoUong: 'CF002', tenDoUong: 'Bạc xỉu', donGia: 35000, trangThai: 'Còn hàng' },
  { maDoUong: 'CF003', tenDoUong: 'Trà đào cam sả', donGia: 40000, trangThai: 'Còn hàng' }
];

const LandingPage = () => {
  const [featuredDrinks, setFeaturedDrinks] = useState(DEFAULT_FEATURED);
  const heroRef = useRef(null);
  const aboutRef = useScrollFade();
  const menuRef = useScrollFade();
  const whyRef = useScrollFade();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/drinks');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const formatted = data.slice(0, 3).map(d => ({
              ...d,
              donGia: parseFloat(d.giaTien || 0),
              trangThai: 'Còn hàng',
              hinhAnh: d.hinhAnh ? (d.hinhAnh.startsWith('data:image') ? d.hinhAnh : `data:image/png;base64,${d.hinhAnh}`) : null
            }));
            setFeaturedDrinks(formatted);
          }
        }
      } catch (err) {
        console.error('Error fetching featured drinks:', err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen font-sans" style={{ background: '#FAFAF7' }}>
      <Navbar />
      <CartDrawer />

      {/* === HERO === */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.png"
            alt="CoffeeSpace - Không gian cà phê hiện đại"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>
        <div ref={heroRef} className="relative z-10 text-left px-6 lg:px-12 max-w-3xl mt-20 pb-32 md:pb-40">
          <p className="text-yellow-400 font-semibold uppercase tracking-[0.2em] text-sm mb-4">
            ✦ Chào mừng đến CoffeeSpace
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Khơi nguồn cảm hứng từ&nbsp;
            <span className="text-yellow-400">hương vị</span> cà phê
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl drop-shadow leading-relaxed">
            Trải nghiệm không gian hiện đại và những tách cà phê được pha chế tỉ mỉ bằng niềm đam mê thực sự.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#menu"
              className="px-8 py-4 bg-primary text-white rounded-full font-bold text-base hover:bg-secondary transition-all transform hover:-translate-y-1 shadow-xl shadow-primary/40 flex items-center gap-2"
            >
              Khám phá thực đơn <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#about"
              className="px-8 py-4 bg-white/20 text-white rounded-full font-bold text-base hover:bg-white/30 backdrop-blur border border-white/30 transition-all"
            >
              Tìm hiểu về chúng tôi
            </a>
          </div>
        </div>
        {/* Floating stats */}
        <div className="absolute bottom-10 inset-x-0 mx-auto z-10 flex gap-4 md:gap-8 flex-wrap justify-center w-full max-w-5xl px-6">
          {[
            { label: 'Khách hàng hài lòng', value: '20,000+' },
            { label: 'Loại thức uống', value: '50+' },
            { label: 'Năm hoạt động', value: '5+' },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-center min-w-[150px] md:min-w-[180px] flex-shrink-0">
              <div className="text-2xl font-extrabold text-white">{s.value}</div>
              <div className="text-sm text-gray-300 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* === WHY US === */}
      <section className="py-20 bg-white">
        <div ref={whyRef} className="section-fade container mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Tại sao chọn chúng tôi</h2>
            <h3 className="text-4xl font-extrabold text-gray-900">Những điều tạo nên sự khác biệt</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Award className="w-8 h-8 text-primary" />, title: 'Chất lượng Premium', desc: 'Hạt cà phê Arabica được chọn lọc kỹ càng từ các vùng trồng nổi tiếng.' },
              { icon: <Leaf className="w-8 h-8 text-primary" />, title: 'Nguyên liệu tự nhiên', desc: 'Cam kết sử dụng nguyên liệu sạch, không phẩm màu, không chất bảo quản.' },
              { icon: <Clock className="w-8 h-8 text-primary" />, title: 'Phục vụ nhanh chóng', desc: 'Hệ thống đặt hàng hiện đại giúp rút ngắn thời gian chờ xuống tối thiểu.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-start p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FEATURED MENU === */}
      <section id="menu" className="py-24" style={{ background: '#FAFAF7' }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div ref={menuRef} className="section-fade text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Thực đơn</h2>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Các Món Nổi Bật</h3>
            <p className="text-gray-500 text-lg">Những thức uống được yêu thích nhất tại CoffeeSpace</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDrinks.map((drink, index) => (
              <DrinkCard key={drink.maDoUong} drink={drink} index={index} />
            ))}
          </div>
          <div className="text-center mt-14">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-secondary transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/30"
            >
              Xem toàn bộ thực đơn <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* === ABOUT === */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-16">
          <div ref={aboutRef} className="section-fade flex-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Về chúng tôi</h2>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Trải nghiệm không gian cà phê đích thực
            </h3>
            <p className="text-gray-600 text-lg mb-5 leading-relaxed">
              Tọa lạc tại trung tâm thành phố, CoffeeSpace mang đến một không gian làm việc và thư giãn lý tưởng với thiết kế hiện đại, nhiều ánh sáng tự nhiên và bầu không khí ấm cúng.
            </p>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Chúng tôi cẩn trọng trong từng khâu — chọn lọc hạt cà phê, rang xay và pha chế — để mỗi ly cà phê mang đến tay bạn đều là một tác phẩm hoàn chỉnh.
            </p>
            <div className="flex items-center gap-10">
              <div>
                <p className="text-5xl font-extrabold text-primary">5+</p>
                <p className="text-gray-500 font-medium mt-1">Năm kinh nghiệm</p>
              </div>
              <div className="w-px h-14 bg-gray-200"></div>
              <div>
                <p className="text-5xl font-extrabold text-primary">20k+</p>
                <p className="text-gray-500 font-medium mt-1">Khách hàng hài lòng</p>
              </div>
              <div className="w-px h-14 bg-gray-200"></div>
              <div>
                <p className="text-5xl font-extrabold text-primary">50+</p>
                <p className="text-gray-500 font-medium mt-1">Loại thức uống</p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative hidden md:block">
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl transform translate-x-6 translate-y-6 -z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
              alt="Coffee preparation"
              className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* === CONTACT === */}
      <section id="contact" className="py-24" style={{ background: '#FAFAF7' }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Liên hệ</h2>
            <h3 className="text-4xl font-extrabold text-gray-900">Tìm chúng tôi ở đây</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: <MapPin className="w-7 h-7 text-primary" />,
                label: 'Địa chỉ',
                value: '123 Nguyễn Văn Cừ, Quận 5',
                sub: 'TP. Hồ Chí Minh'
              },
              {
                icon: <Phone className="w-7 h-7 text-primary" />,
                label: 'Điện thoại',
                value: '0784589141',
                sub: 'Thứ 2 – CN · 7:00 – 22:00'
              },
              {
                icon: <Mail className="w-7 h-7 text-primary" />,
                label: 'Email',
                value: 'hovanphuc9141@gmail.com',
                sub: 'Phản hồi trong 24h'
              },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  {c.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{c.label}</p>
                <p className="text-xl font-bold text-gray-900 mb-1">{c.value}</p>
                <p className="text-sm text-gray-400">{c.sub}</p>
              </div>
            ))}
          </div>
          {/* Embedded map placeholder */}
          <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-72">
            <iframe
              title="Bản đồ CoffeeSpace"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.523847380591!2d106.68291317480625!3d10.762621059671638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b7c3b3b43%3A0x7b3b3b3b3b3b3b3b!2zTmd1eeG7hW4gVsSDbiBD4burLCBRdeG6rW4gNSwgVFAuIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2svn!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
