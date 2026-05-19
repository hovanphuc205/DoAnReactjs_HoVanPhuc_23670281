import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // State dành riêng cho "Mua ngay" - không ảnh hưởng đến giỏ hàng chính
  const [buyNowItem, setBuyNowItem] = useState(null);

  const addToCart = (drink) => {
    setCart(prev => {
      const existing = prev.find(i => i.maDoUong === drink.maDoUong);
      if (existing) {
        return prev.map(i => i.maDoUong === drink.maDoUong
          ? { ...i, soLuong: i.soLuong + 1 }
          : i
        );
      }
      // Mặc định món mới thêm vào sẽ được chọn (selected: true)
      return [...prev, { ...drink, soLuong: 1, selected: true }];
    });
    setIsCartOpen(true);
  };

  const toggleSelect = (id) => {
    setCart(prev => prev.map(i => 
      i.maDoUong === id ? { ...i, selected: !i.selected } : i
    ));
  };

  const toggleSelectAll = (isSelected) => {
    setCart(prev => prev.map(i => ({ ...i, selected: isSelected })));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.maDoUong !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev =>
      prev.map(i => i.maDoUong === id ? { ...i, soLuong: Math.max(1, i.soLuong + delta) } : i)
    );
  };

  const startBuyNow = (drink) => {
    setBuyNowItem({ ...drink, soLuong: 1 });
  };

  const clearCheckoutItems = () => {
    if (buyNowItem) {
      setBuyNowItem(null);
    } else {
      // Chỉ xóa những món đã được chọn để mua trong giỏ hàng
      setCart(prev => prev.filter(i => !i.selected));
    }
  };

  // Tính toán dựa trên những món ĐƯỢC CHỌN trong giỏ hàng
  const selectedItems = cart.filter(i => i.selected);
  const cartTotal = selectedItems.reduce((sum, i) => sum + i.donGia * i.soLuong, 0);
  const cartItemCount = selectedItems.reduce((sum, i) => sum + i.soLuong, 0);

  // Hàm lấy danh sách món để hiển thị ở trang Checkout
  const getCheckoutData = () => {
    if (buyNowItem) {
      return {
        items: [buyNowItem],
        total: buyNowItem.donGia * buyNowItem.soLuong,
        isBuyNow: true
      };
    }
    return {
      items: selectedItems,
      total: cartTotal,
      isBuyNow: false
    };
  };

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, toggleSelect, toggleSelectAll,
      cartTotal, cartItemCount, isCartOpen, setIsCartOpen,
      startBuyNow, buyNowItem, setBuyNowItem, getCheckoutData, clearCheckoutItems,
      selectedItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
