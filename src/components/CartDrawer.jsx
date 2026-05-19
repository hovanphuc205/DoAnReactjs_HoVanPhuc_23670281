import React from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { 
    cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, 
    cartTotal, cartItemCount, toggleSelect, toggleSelectAll, setBuyNowItem 
  } = useCart();

  const allSelected = cart.length > 0 && cart.every(i => i.selected);

  const handleCheckoutClick = () => {
    setBuyNowItem(null); // Đảm bảo không ở chế độ Buy Now khi đi từ Giỏ hàng
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Giỏ hàng</h2>
              <p className="text-xs text-gray-400">{cart.length} món trong danh sách</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Select All */}
        {cart.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 flex items-center justify-between border-b border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div 
                onClick={() => toggleSelectAll(!allSelected)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  allSelected ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary'
                }`}
              >
                {allSelected && <Check size={12} className="text-white" strokeWidth={4} />}
              </div>
              <span className="text-sm font-bold text-gray-600">Chọn tất cả</span>
            </label>
            <span className="text-xs text-gray-400 font-medium">Đã chọn {cart.filter(i => i.selected).length} món</span>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Giỏ hàng của bạn đang trống</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-primary font-semibold underline underline-offset-4"
              >
                Xem thực đơn
              </button>
            </div>
          ) : cart.map(item => (
            <div key={item.maDoUong} className={`flex gap-4 p-4 rounded-2xl border transition-all ${
              item.selected ? 'bg-white border-primary shadow-sm' : 'bg-gray-50/50 border-transparent opacity-70'
            }`}>
              {/* Checkbox */}
              <div 
                onClick={() => toggleSelect(item.maDoUong)}
                className={`w-5 h-5 mt-1 rounded border-2 flex items-center justify-center cursor-pointer transition-all shrink-0 ${
                  item.selected ? 'bg-primary border-primary' : 'border-gray-300 hover:border-primary'
                }`}
              >
                {item.selected && <Check size={12} className="text-white" strokeWidth={4} />}
              </div>

              <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                <img
                  src={`https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=100&q=80`}
                  alt={item.tenDoUong}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-gray-900 truncate">{item.tenDoUong}</p>
                  <button
                    onClick={() => removeFromCart(item.maDoUong)}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-primary font-extrabold text-sm mb-2">{item.donGia.toLocaleString()}đ</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.maDoUong, -1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-6 text-center font-bold text-sm">{item.soLuong}</span>
                  <button
                    onClick={() => updateQuantity(item.maDoUong, 1)}
                    className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-6 border-t border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">Tổng tiền thanh toán</span>
                <span className="text-2xl font-extrabold text-primary">{cartTotal.toLocaleString()}đ</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 font-medium">Đã chọn {cartItemCount} món</span>
              </div>
            </div>
            <Link
              to="/checkout"
              onClick={handleCheckoutClick}
              className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-base transition-all transform hover:-translate-y-0.5 shadow-lg ${
                cartItemCount > 0 
                  ? 'bg-primary text-white shadow-primary/25 hover:bg-secondary'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none hover:transform-none'
              }`}
              style={cartItemCount === 0 ? { pointerEvents: 'none' } : {}}
            >
              Đặt hàng ngay <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
