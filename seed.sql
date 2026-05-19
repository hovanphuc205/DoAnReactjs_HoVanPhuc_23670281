SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE tai_khoan;
TRUNCATE TABLE nhan_vien;
TRUNCATE TABLE ban;
TRUNCATE TABLE do_uong;
TRUNCATE TABLE hoa_don;
TRUNCATE TABLE chi_tiet_hoa_don;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO nhan_vien (ma_nhan_vien, ho_ten, chuc_vu) VALUES
('NV01', 'Admin Quản Lý', 'Manager'),
('NV02', 'Nhân Viên Ca Sáng', 'Staff');

INSERT INTO tai_khoan (ma_tai_khoan, ten_dang_nhap, mat_khau, tai_khoan_quan_li, ma_nhan_vien) VALUES
('TK01', 'admin', '123', 1, 'NV01'),
('TK02', 'staff', '123', 0, 'NV02');

INSERT INTO ban (ma_ban, trang_thai, vi_tri) VALUES
('B01', 'Trống', 'Tầng 1'),
('B02', 'Trống', 'Tầng 1'),
('B03', 'Trống', 'Tầng 2'),
('B04', 'Trống', 'Tầng 2');

INSERT INTO do_uong (ma_do_uong, ten_do_uong, gia_tien, loai_do_uong) VALUES
('DU01', 'Cà phê đen', 20000, 'Cà phê'),
('DU02', 'Bạc xỉu', 25000, 'Cà phê'),
('DU03', 'Trà đào cam sả', 35000, 'Trà'),
('DU04', 'Nước ép cam', 30000, 'Nước ép');
