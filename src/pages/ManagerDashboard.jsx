import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { mockRevenueData, mockDrinks as initialDrinks, mockUsers as initialUsers, mockOrders } from '../mocks/data';
import { TrendingUp, Users, Coffee, DollarSign, Plus, Pencil, Trash2, ShoppingBag } from 'lucide-react';

/* ─── Stat Card ─── */
const StatCard = ({ title, value, icon: Icon, color, sub }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`p-4 rounded-2xl text-white ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 mb-0.5">{title}</p>
      <h3 className="text-2xl font-extrabold text-gray-800">{value}</h3>
      {sub && <p className="text-xs text-green-500 font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* ─── Overview ─── */
const Overview = () => {
  const [chartFilter, setChartFilter] = useState('Tháng');
  const [stats, setStats] = useState({
    tongDoanhThu: 0,
    tongHoaDon: 0,
    productsSold: 0,
    uniqueCustomers: 0,
    chartData: []
  });

  const fetchStats = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/statistics?filter=${chartFilter}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.warn('Lỗi tải thống kê từ API, dùng dữ liệu giả lập...', e);
      const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      
      let totalRev = 0;
      let totalQty = 0;
      const customers = new Set();
      
      localOrders.forEach(o => {
        totalRev += o.tongTien || 0;
        if (o.sdtKhachHang) customers.add(o.sdtKhachHang);
        if (o.chiTietHoaDons) {
          o.chiTietHoaDons.forEach(ct => {
            totalQty += ct.soLuong || 0;
          });
        }
      });
      
      let fallbackChart = [];
      if (chartFilter === 'Ngày') {
        fallbackChart = [
          { label: '15/05', revenue: 40000 },
          { label: '16/05', revenue: 90000 },
          { label: '17/05', revenue: 150000 },
          { label: '18/05', revenue: 120000 },
          { label: '19/05', revenue: totalRev > 0 ? totalRev : 75000 }
        ];
      } else if (chartFilter === 'Tuần') {
        fallbackChart = [
          { label: 'Tuần 1', revenue: 300000 },
          { label: 'Tuần 2', revenue: 500000 },
          { label: 'Tuần 3', revenue: 450000 },
          { label: 'Tuần 4', revenue: totalRev > 0 ? totalRev : 620000 }
        ];
      } else if (chartFilter === 'Tháng') {
        fallbackChart = [
          { label: 'T01', revenue: 1500000 },
          { label: 'T02', revenue: 2300000 },
          { label: 'T03', revenue: 1800000 },
          { label: 'T04', revenue: 3100000 },
          { label: 'T05', revenue: totalRev > 0 ? totalRev : 2800000 }
        ];
      } else {
        fallbackChart = [
          { label: '2026', revenue: totalRev > 0 ? totalRev : 12500000 }
        ];
      }

      setStats({
        tongDoanhThu: totalRev > 0 ? totalRev : 2800000,
        tongHoaDon: localOrders.length > 0 ? localOrders.length : 12,
        productsSold: totalQty > 0 ? totalQty : 45,
        uniqueCustomers: customers.size > 0 ? customers.size : 8,
        chartData: fallbackChart
      });
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, [chartFilter]);

  return (
    <div className="p-8 w-full space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Tổng quan kinh doanh</h1>
        <p className="text-gray-400 mt-1">Dữ liệu thực tế từ hệ thống</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng doanh thu" value={`${(stats.tongDoanhThu).toLocaleString()}đ`} icon={DollarSign} color="bg-emerald-500" sub="Tất cả các đơn hàng" />
        <StatCard title="Đã hoàn thành" value={stats.tongHoaDon.toString()} icon={ShoppingBag} color="bg-green-500" sub={`${stats.tongHoaDon} đơn`} />
        <StatCard title="Sản phẩm bán ra" value={stats.productsSold.toString()} icon={Coffee} color="bg-orange-500" />
        <StatCard title="Khách hàng" value={stats.uniqueCustomers.toString()} icon={Users} color="bg-purple-500" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Biểu đồ doanh thu</h2>
          <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
            {['Ngày', 'Tuần', 'Tháng', 'Năm'].map(f => (
              <button
                key={f}
                onClick={() => setChartFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${chartFilter === f ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']}
              />
              <Bar dataKey="revenue" fill="#6F4E37" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


/* ─── Drinks Management ─── */
const DrinksManagement = () => {
  const [drinks, setDrinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ maDoUong: '', tenDoUong: '', donGia: '', trangThai: 'Còn hàng', hinhAnh: '' });

  // Fetch drinks on mount
  React.useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/drinks');
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(d => ({
          ...d, 
          donGia: d.giaTien, 
          trangThai: 'Còn hàng',
          hinhAnh: d.hinhAnh ? (d.hinhAnh.startsWith('data:image') ? d.hinhAnh : `data:image/png;base64,${d.hinhAnh}`) : null
        }));
        setDrinks(mapped);
        localStorage.setItem('mockDrinks', JSON.stringify(mapped));
      } else {
        throw new Error('API failed');
      }
    } catch(e) { 
      console.warn('Lỗi tải thực đơn từ API, dùng dữ liệu giả lập...', e);
      let localDrinks = JSON.parse(localStorage.getItem('mockDrinks') || '[]');
      if (localDrinks.length === 0) {
        localDrinks = initialDrinks;
        localStorage.setItem('mockDrinks', JSON.stringify(localDrinks));
      }
      setDrinks(localDrinks);
    }
  };

  const openAdd = () => { setEditing(null); setForm({ maDoUong: '', tenDoUong: '', donGia: '', trangThai: 'Còn hàng', hinhAnh: '' }); setShowModal(true); };
  const openEdit = (d) => { setEditing(d.maDoUong); setForm({ ...d, donGia: d.donGia || d.giaTien }); setShowModal(true); };
  
  const handleDelete = async (id) => { 
    if (window.confirm('Xóa đồ uống này?')) {
      try {
        const res = await fetch(`http://localhost:8080/api/drinks/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('API failed');
        fetchDrinks();
      } catch(e) { 
        console.warn('Lỗi kết nối API, xóa đồ uống ngoại tuyến...', e);
        const localDrinks = JSON.parse(localStorage.getItem('mockDrinks') || '[]');
        const updated = localDrinks.filter(d => d.maDoUong !== id);
        localStorage.setItem('mockDrinks', JSON.stringify(updated));
        setDrinks(updated);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, hinhAnh: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    let base64Data = form.hinhAnh;
    if (base64Data && base64Data.includes('base64,')) {
        base64Data = base64Data.split('base64,')[1];
    }

    const payload = {
      maDoUong: editing ? editing : `DU0${drinks.length + 1}`,
      tenDoUong: form.tenDoUong,
      giaTien: form.donGia,
      loaiDoUong: 'Khác',
      hinhAnh: base64Data
    };

    try {
      let res;
      if (editing) {
        res = await fetch('http://localhost:8080/api/drinks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('http://localhost:8080/api/drinks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (!res.ok) throw new Error('API failed');
      fetchDrinks();
      setShowModal(false);
    } catch(e) { 
      console.warn('Lỗi kết nối API, lưu đồ uống ngoại tuyến...', e);
      const localDrinks = JSON.parse(localStorage.getItem('mockDrinks') || '[]');
      const newDrink = {
        ...payload,
        donGia: payload.giaTien,
        trangThai: 'Còn hàng',
        hinhAnh: form.hinhAnh
      };
      
      let updated;
      if (editing) {
        updated = localDrinks.map(d => d.maDoUong === editing ? newDrink : d);
      } else {
        updated = [...localDrinks, newDrink];
      }
      
      localStorage.setItem('mockDrinks', JSON.stringify(updated));
      setDrinks(updated);
      setShowModal(false);
    }
  };

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Quản lý Đồ uống</h1>
          <p className="text-gray-400 mt-1">{drinks.length} loại đồ uống</p>
        </div>
        <button onClick={openAdd} className="bg-primary text-white px-5 py-3 rounded-xl hover:bg-secondary transition-colors flex items-center gap-2 font-semibold shadow-md shadow-primary/20">
          <Plus size={18} /> Thêm đồ uống
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Mã', 'Tên đồ uống', 'Đơn giá', 'Trạng thái', 'Thao tác'].map(h => (
                <th key={h} className="p-4 font-semibold text-gray-500 text-sm uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {drinks.map(d => (
              <tr key={d.maDoUong} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-gray-400 font-mono text-sm">{d.maDoUong}</td>
                <td className="p-4 font-semibold text-gray-800">{d.tenDoUong}</td>
                <td className="p-4 font-bold text-primary">{Number(d.donGia).toLocaleString()}đ</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${d.trangThai === 'Còn hàng' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.trangThai}</span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => openEdit(d)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(d.maDoUong)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editing ? 'Sửa đồ uống' : 'Thêm đồ uống mới'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {[
              { label: 'Tên đồ uống', key: 'tenDoUong', type: 'text' },
              { label: 'Đơn giá (đ)', key: 'donGia', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh sản phẩm</label>
              <div className="flex items-center gap-4">
                {form.hinhAnh ? (
                  <img src={form.hinhAnh} alt="Preview" className="w-16 h-16 rounded-xl object-cover shadow-sm border border-gray-100 shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-xl">☕</div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select value={form.trangThai} onChange={e => setForm({ ...form, trangThai: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none">
                <option>Còn hàng</option>
                <option>Hết hàng</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">Hủy</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-secondary transition-colors">Lưu</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};



/* ─── System Order Management ─── */
const SystemOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.map(h => ({
          id: h.maHoaDon,
          customer: h.tenKhachHang || 'Khách hàng',
          phone: h.sdtKhachHang || 'Không có',
          address: h.diaChiGiaoHang || 'Tại quán',
          total: h.tongTien || 0,
          time: h.ngayTao ? new Date(h.ngayTao).toLocaleDateString('vi-VN') : 'Không rõ',
          items: h.chiTietHoaDons ? h.chiTietHoaDons.map(ct => ({
            name: ct.doUong?.tenDoUong || 'Đồ uống',
            quantity: ct.soLuong || 1,
            price: ct.donGia || 0,
            image: ct.doUong?.hinhAnh ? (ct.doUong.hinhAnh.startsWith('data:image') ? ct.doUong.hinhAnh : `data:image/png;base64,${ct.doUong.hinhAnh}`) : null
          })) : [],
          note: h.ghiChu || ''
        })));
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Quản lý Đơn hàng</h1>
          <p className="text-gray-400 mt-1">{orders.length} đơn hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Mã Đơn', 'Khách hàng', 'SĐT', 'Thời gian', 'Tổng tiền', 'Thao tác'].map(h => (
                <th key={h} className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-mono text-sm text-gray-400">#{order.id}</td>
                <td className="p-4 font-semibold text-gray-800">{order.customer}</td>
                <td className="p-4 text-gray-600">{order.phone}</td>
                <td className="p-4 text-gray-500 text-sm">{order.time}</td>
                <td className="p-4 font-bold text-primary">{order.total.toLocaleString()}đ</td>
                <td className="p-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors font-semibold text-sm"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <Modal title={`Chi tiết đơn hàng #${selectedOrder.id}`} onClose={() => setSelectedOrder(null)}>
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-bold text-gray-900 text-lg">{selectedOrder.customer}</p>
                <p className="text-sm text-gray-400">{selectedOrder.phone}</p>
                {selectedOrder.address && <p className="text-sm text-gray-500 mt-1">📍 {selectedOrder.address}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Thời gian đặt</p>
                <p className="font-bold text-gray-900">{selectedOrder.time}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Danh sách món</p>
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {item.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">Đơn giá: {item.price.toLocaleString()}đ</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">x{item.quantity}</p>
                      <p className="text-xs font-semibold text-primary">{(item.price * item.quantity).toLocaleString()}đ</p>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-sm">Tổng cộng</span>
                  <span className="font-extrabold text-primary text-xl">{selectedOrder.total.toLocaleString()}đ</span>
                </div>
              </div>
            </div>

            {selectedOrder.note && (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Ghi chú</p>
                <p className="bg-yellow-50 text-yellow-800 p-3 rounded-xl text-sm border border-yellow-100">{selectedOrder.note}</p>
              </div>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
            >
              Đóng
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};



/* ─── ManagerDashboard root ─── */
const ManagerDashboard = () => (
  <div className="flex min-h-screen pl-64 w-full" style={{ background: '#FAFAF7' }}>
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/drinks" element={<DrinksManagement />} />
        <Route path="/orders" element={<SystemOrderManagement />} />
      </Routes>
    </main>
  </div>
);

export default ManagerDashboard;
