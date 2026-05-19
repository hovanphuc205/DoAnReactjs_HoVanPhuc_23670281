package entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"chiTietHoaDons"})
@Builder

@Entity
@Table(name = "hoa_don")
public class HoaDon implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "ma_hoa_don")
    private String maHoaDon;

    @Column(name = "ngay_tao")
    private LocalDate ngayTao;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "phuong_thuc_tt")
    private String phuongThucTT;

    @Column(name = "ghi_chu")
    private String ghiChu;

    @Column(name = "tong_tien")
    private Double tongTien;

    @Column(name = "ten_khach_hang")
    private String tenKhachHang;

    @Column(name = "sdt_khach_hang")
    private String sdtKhachHang;

    @Column(name = "dia_chi_giao_hang")
    private String diaChiGiaoHang;

    // HoaDon 1 --- * ChiTietHoaDon
    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ChiTietHoaDon> chiTietHoaDons;
}