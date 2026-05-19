// Mock Data for Coffee Management System

export const mockUsers = [
  { maTaiKhoan: 'TK01', tenDangNhap: 'admin', matKhau: '123', taiKhoanQuanLi: 1, maNhanVien: 'NV01', tenNhanVien: 'Admin Quản Lý' },
  { maTaiKhoan: 'TK02', tenDangNhap: 'staff', matKhau: '123', taiKhoanQuanLi: 0, maNhanVien: 'NV02', tenNhanVien: 'Nhân Viên Ca Sáng' }
];

export const mockDrinks = [
  { maDoUong: 'DU01', tenDoUong: 'Cà phê đen', donGia: 20000, giaTien: 20000, loaiDoUong: 'Cà phê', trangThai: 'Còn hàng' },
  { maDoUong: 'DU02', tenDoUong: 'Bạc xỉu', donGia: 25000, giaTien: 25000, loaiDoUong: 'Cà phê', trangThai: 'Còn hàng' },
  { maDoUong: 'DU03', tenDoUong: 'Trà đào cam sả', donGia: 35000, giaTien: 35000, loaiDoUong: 'Trà', trangThai: 'Còn hàng' },
  { maDoUong: 'DU04', tenDoUong: 'Nước ép cam', donGia: 30000, giaTien: 30000, loaiDoUong: 'Nước ép', trangThai: 'Còn hàng' }
];

export const mockOrders = [
  {
    id: 'CS12345',
    customer: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '12 Nguyễn Văn Bảo, Gò Vấp, TP.HCM',
    total: 80000,
    time: '19/05/2026, 09:30:15',
    items: [
      { name: 'Cà phê đen', quantity: 2, price: 20000 },
      { name: 'Trà đào cam sả', quantity: 1, price: 35000 }
    ],
    note: 'Ít đường'
  }
];

export const mockInvoices = [];

export const mockRevenueData = [
  { label: 'T01', revenue: 1500000 },
  { label: 'T02', revenue: 2300000 },
  { label: 'T03', revenue: 1800000 },
  { label: 'T04', revenue: 3100000 },
  { label: 'T05', revenue: 2800000 },
  { label: 'T06', revenue: 3500000 },
  { label: 'T07', revenue: 4200000 },
  { label: 'T08', revenue: 3900000 },
  { label: 'T09', revenue: 4500000 },
  { label: 'T10', revenue: 4800000 },
  { label: 'T11', revenue: 5200000 },
  { label: 'T12', revenue: 6000000 }
];

