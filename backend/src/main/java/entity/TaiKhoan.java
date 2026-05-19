package entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder

@Entity
@Table(name = "tai_khoan")
public class TaiKhoan implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "ma_tai_khoan")
    private String maTaiKhoan;

    @Column(name = "ten_dang_nhap", unique = true)
    private String tenDangNhap;

    @Column(name = "mat_khau")
    private String matKhau;

    @Column(name = "tai_khoan_quan_li")
    private boolean taiKhoanQuanLi;

    @Column(name = "trang_thai")
    private String trangThai;
}