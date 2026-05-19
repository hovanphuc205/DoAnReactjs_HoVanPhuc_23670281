import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Truck, CreditCard, Wallet, Check, ShoppingBag, ChevronRight, Info, Minus, Plus, Printer } from 'lucide-react';
import { mockOrders } from '../mocks/data';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng', desc: 'Trả tiền mặt khi nhận đồ', icon: <Truck size={22} /> },
  { id: 'bank', label: 'Chuyển khoản ngân hàng', desc: 'MB Bank / Vietcombank / Techcombank', icon: <CreditCard size={22} /> },
  { id: 'ewallet', label: 'Ví điện tử', desc: 'MoMo / ZaloPay / VNPay', icon: <Wallet size={22} /> },
];

const generateOrderId = () => 'CS' + Math.random().toString(36).substr(2, 7).toUpperCase();

const Checkout = () => {
  const { getCheckoutData, clearCheckoutItems, updateQuantity, setBuyNowItem } = useCart();
  const navigate = useNavigate();
  
  const checkoutData = getCheckoutData();
  const { items, total, isBuyNow } = checkoutData;

  const [form, setForm] = useState({
    name: '', phone: '', address: '', note: '', paymentMethod: 'cod'
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [orderId, setOrderId] = useState('');
  
  // Lưu trữ bản sao của đơn hàng để hiển thị sau khi đã xóa giỏ hàng thật
  const [orderSummary, setOrderSummary] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên';
    if (!form.phone.match(/^0\d{9}$/)) e.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
    if (!form.address.trim()) e.address = 'Vui lòng nhập địa chỉ';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpdateQty = (id, delta) => {
    if (isBuyNow) {
      // Nếu là Buy Now, cập nhật trực tiếp item duy nhất
      setBuyNowItem(prev => ({
        ...prev,
        soLuong: Math.max(1, prev.soLuong + delta)
      }));
    } else {
      // Nếu là giỏ hàng, cập nhật qua context
      updateQuantity(id, delta);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const payload = {
      tenKhachHang: form.name,
      sdtKhachHang: form.phone,
      diaChiGiaoHang: form.address,
      ghiChu: form.note || '',
      phuongThucTT: form.paymentMethod === 'cod' ? 'Tiền mặt' : (form.paymentMethod === 'bank' ? 'Chuyển khoản' : 'Ví điện tử'),
      tongTien: total,
      items: items.map(i => ({
        maDoUong: i.maDoUong,
        soLuong: i.soLuong,
        donGia: i.donGia || i.giaTien
      }))
    };

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const resData = await response.json();
        const generatedId = resData.maHoaDon || generateOrderId();
        setOrderId(generatedId);

        const summary = {
          items: [...items],
          total: total,
          customer: { ...form },
          date: new Date().toLocaleString('vi-VN')
        };
        setOrderSummary(summary);
        setStep('success');
      } else {
        alert('Lỗi đặt hàng từ máy chủ. Vui lòng thử lại!');
      }
    } catch (err) {
      console.warn('Lỗi kết nối máy chủ, tiến hành tạo đơn hàng ngoại tuyến...', err);
      const generatedId = generateOrderId();
      setOrderId(generatedId);

      const summary = {
        items: [...items],
        total: total,
        customer: { ...form },
        date: new Date().toLocaleString('vi-VN')
      };
      
      // Lưu đơn hàng ảo vào localStorage để trang Dashboard có thể lấy thống kê khi offline
      try {
        const existingOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
        existingOrders.unshift({
          maHoaDon: generatedId,
          tenKhachHang: form.name,
          sdtKhachHang: form.phone,
          diaChiGiaoHang: form.address,
          ghiChu: form.note || '',
          phuongThucTT: form.paymentMethod === 'cod' ? 'Tiền mặt' : (form.paymentMethod === 'bank' ? 'Chuyển khoản' : 'Ví điện tử'),
          tongTien: total,
          ngayTao: new Date().toISOString().split('T')[0],
          chiTietHoaDons: items.map(i => ({
            soLuong: i.soLuong,
            donGia: i.donGia || i.giaTien,
            doUong: { tenDoUong: i.tenDoUong }
          }))
        });
        localStorage.setItem('mockOrders', JSON.stringify(existingOrders));
      } catch (e) {
        console.error('Lỗi lưu đơn hàng ảo:', e);
      }

      setOrderSummary(summary);
      setStep('success');
    }
  };

  useEffect(() => {
    if (step === 'success') {
      window.scrollTo(0, 0);
      clearCheckoutItems(); // Xóa giỏ hàng thực sau khi đã lưu summary
    }
  }, [step]);

  if (items.length === 0 && step === 'form') {
    return (
      <div className="min-h-screen font-sans" style={{ background: '#FAFAF7' }}>
        <Navbar />
        <CartDrawer />
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Chưa có sản phẩm nào để thanh toán</h2>
          <Link to="/menu" className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-secondary transition-all">
            Xem thực đơn
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'success' && orderSummary) {
    return (
      <div className="min-h-screen font-sans flex flex-col" style={{ background: '#FAFAF7' }}>
        <Navbar />
        <CartDrawer />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-24">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Đặt hàng thành công!</h2>
          <p className="text-gray-500 mb-10 text-center">Cảm ơn bạn đã tin tưởng CoffeeSpace.</p>

          {/* BILL CHI TIẾT */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-2xl w-full border border-gray-100 mb-8">
            <div className="bg-primary p-6 text-white text-center">
              <h3 className="text-xl font-bold uppercase tracking-widest">Hóa đơn điện tử</h3>
              <p className="text-white/70 text-sm mt-1">Mã đơn: #{orderId} • {orderSummary.date}</p>
            </div>
            
            <div className="p-8">
              {/* Info khách */}
              <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                <div>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-2">Người nhận</p>
                  <p className="font-bold text-gray-900">{orderSummary.customer.name}</p>
                  <p className="text-gray-500">{orderSummary.customer.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-2">Địa chỉ giao hàng</p>
                  <p className="text-gray-900 font-medium">{orderSummary.customer.address}</p>
                </div>
              </div>

              {/* Bảng món */}
              <div className="border-t border-b border-gray-100 py-6 mb-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                      <th className="pb-4">Sản phẩm</th>
                      <th className="pb-4 text-center">SL</th>
                      <th className="pb-4 text-right">Đơn giá</th>
                      <th className="pb-4 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orderSummary.items.map((item, idx) => (
                      <tr key={idx} className="text-sm">
                        <td className="py-4 font-bold text-gray-900">{item.tenDoUong}</td>
                        <td className="py-4 text-center font-medium">{item.soLuong}</td>
                        <td className="py-4 text-right text-gray-500">{item.donGia.toLocaleString()}đ</td>
                        <td className="py-4 text-right font-bold text-gray-900">{(item.donGia * item.soLuong).toLocaleString()}đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tổng kết */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tạm tính</span>
                  <span>{orderSummary.total.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-bold uppercase text-[10px]">Miễn phí</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-3xl font-extrabold text-primary">{orderSummary.total.toLocaleString()}đ</span>
                </div>
              </div>

              {orderSummary.customer.paymentMethod === 'bank' && (
                <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-sm">
                  <p className="font-bold text-blue-800 mb-2">Thông tin thanh toán:</p>
                  <p className="text-blue-700">Ngân hàng: MB Bank • 0123456789 • COFFEESPACE</p>
                  <p className="text-blue-700">Nội dung: CK {orderId}</p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
              <button onClick={() => window.print()} className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors">
                <Printer size={14} /> In hóa đơn này
              </button>
            </div>
          </div>

          <Link to="/menu" className="px-10 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-all transform hover:-translate-y-1">
            Quay lại cửa hàng
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: '#FAFAF7' }}>
      <Navbar />
      <CartDrawer />

      <div className="container mx-auto px-6 lg:px-12 pt-28 pb-16">
        <Link to="/menu" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-medium">
          <ArrowLeft size={18} /> Quay lại
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Xác nhận đơn hàng</h1>
          {isBuyNow && (
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-primary/20">
              <Info size={16} /> Chế độ Mua ngay
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin giao hàng</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className={`w-full px-4 py-3.5 rounded-2xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại *</label>
                    <input
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="0912 345 678"
                      className={`w-full px-4 py-3.5 rounded-2xl border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phương thức thanh toán</label>
                    <select 
                      value={form.paymentMethod}
                      onChange={e => setForm({...form, paymentMethod: e.target.value})}
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                    >
                      {PAYMENT_METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ nhận hàng *</label>
                  <textarea
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="Số nhà, tên đường, quận/huyện..."
                    rows={2}
                    className={`w-full px-4 py-3.5 rounded-2xl border ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú cho quán</label>
                  <textarea
                    value={form.note}
                    onChange={e => setForm({ ...form, note: e.target.value })}
                    placeholder="VD: Ít đá, không đường, giao trong giờ hành chính..."
                    rows={2}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-extrabold text-lg hover:bg-secondary transition-all transform hover:-translate-y-0.5 shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
              Xác nhận & Đặt hàng ngay <ChevronRight size={20} />
            </button>
          </form>

          {/* SẢN PHẨM & SỐ LƯỢNG */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Chi tiết đơn hàng</h2>
              <div className="space-y-6 mb-8">
                {items.map(item => (
                  <div key={item.maDoUong} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center">
                      {item.hinhAnh ? (
                        <img src={item.hinhAnh} alt={item.tenDoUong} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                          {item.tenDoUong[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-gray-900 truncate pr-2">{item.tenDoUong}</p>
                        <p className="font-extrabold text-gray-900">{(item.donGia * item.soLuong).toLocaleString()}đ</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                          <button type="button" onClick={() => handleUpdateQty(item.maDoUong, -1)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-primary"><Minus size={12} /></button>
                          <span className="w-4 text-center text-xs font-bold">{item.soLuong}</span>
                          <button type="button" onClick={() => handleUpdateQty(item.maDoUong, 1)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-primary"><Plus size={12} /></button>
                        </div>
                        <span className="text-xs text-gray-400">{item.donGia.toLocaleString()}đ / ly</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-500 font-medium text-sm">Tổng cộng</span>
                  <span className="font-extrabold text-primary text-3xl">{total.toLocaleString()}đ</span>
                </div>
                <p className="text-[10px] text-center text-gray-400">Giá đã bao gồm thuế và phí phục vụ.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
