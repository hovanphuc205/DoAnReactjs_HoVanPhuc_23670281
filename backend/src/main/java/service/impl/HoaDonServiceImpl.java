package service.impl;

import dao.impl.HoaDonDaoImpl;
import db.JPAUtil;
import dto.ChiTietHoaDonDTO;
import dto.HoaDonDTO;
import entity.ChiTietHoaDon;
import entity.HoaDon;
import entity.DoUong;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import mapper.Mapper;
import service.HoaDonService;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;
import dto.ThongKeDTO;
import dto.ThongKeDoUongDTO;

public class HoaDonServiceImpl implements HoaDonService {
    private static final String TRANG_THAI_CHUA_THANH_TOAN = "Chưa thanh toán";
    private static final String TRANG_THAI_DA_THANH_TOAN = "Đã thanh toán";

    private final HoaDonDaoImpl hoaDonDao;

    public HoaDonServiceImpl() {
        this.hoaDonDao = new HoaDonDaoImpl();
    }

    @Override
    public List<HoaDonDTO> getAllInvoices() {
        return hoaDonDao.findAll().stream()
                .map(h -> Mapper.map(h, HoaDonDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean createInvoice(HoaDonDTO hdDto) {
        HoaDon hd = Mapper.map(hdDto, HoaDon.class);
        return hoaDonDao.insert(hd);
    }

    @Override
    public List<HoaDonDTO> getInvoicesByDate(java.time.LocalDate date) {
        return hoaDonDao.findByDate(date).stream()
                .map(h -> Mapper.map(h, HoaDonDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<HoaDonDTO> findInvoicesByDateRange(java.time.LocalDate fromDate, java.time.LocalDate toDate) {
        return hoaDonDao.findByDateRange(fromDate, toDate).stream()
                .map(h -> Mapper.map(h, HoaDonDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean handleOrderFood(HoaDonDTO phieuDto, List<ChiTietHoaDonDTO> cartDto) {
        EntityManager em = JPAUtil.getEntityManager();
        EntityTransaction tr = em.getTransaction();
        try {
            tr.begin();

            if (phieuDto.getMaHoaDon() == null || phieuDto.getMaHoaDon().isEmpty()) {
                phieuDto.setMaHoaDon(util.IdGenerator.generateHoaDonId());
            }
            HoaDon phieu = Mapper.map(phieuDto, HoaDon.class);
            phieu.setTrangThai(phieuDto.getTrangThai() != null ? phieuDto.getTrangThai() : TRANG_THAI_CHUA_THANH_TOAN);
            em.persist(phieu);

            String cthdPrefix = "CTHD"
                    + java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("ddMMyyyy"));
            String maxIdQuery = "SELECT MAX(c.id) FROM ChiTietHoaDon c WHERE c.id LIKE :prefix";
            String maxIdStr = em.createQuery(maxIdQuery, String.class)
                    .setParameter("prefix", cthdPrefix + "%")
                    .getSingleResult();
            int nextIndex = 1;
            if (maxIdStr != null && maxIdStr.length() > 12) {
                try { nextIndex = Integer.parseInt(maxIdStr.substring(12)) + 1; } catch (Exception e) {}
            }

            for (ChiTietHoaDonDTO ctDto : cartDto) {
                ChiTietHoaDon ct = Mapper.map(ctDto, ChiTietHoaDon.class);
                ct.setHoaDon(phieu);
                ct.setId(String.format("%s%03d", cthdPrefix, nextIndex++));
                if (ct.getDoUong() != null) {
                    DoUong managedDoUong = em.find(DoUong.class, ct.getDoUong().getMaDoUong());
                    ct.setDoUong(managedDoUong);
                }
                em.persist(ct);
            }

            tr.commit();
            return true;
        } catch (Exception e) {
            if (tr.isActive()) tr.rollback();
            e.printStackTrace();
            return false;
        } finally {
            em.close();
        }
    }

    @Override
    public boolean handlePayment(HoaDonDTO hoaDonDto) {
        EntityManager em = JPAUtil.getEntityManager();
        EntityTransaction tr = em.getTransaction();
        try {
            tr.begin();
            HoaDon managed = em.find(HoaDon.class, hoaDonDto.getMaHoaDon());
            if (managed == null) { tr.rollback(); return false; }
            managed.setTrangThai(TRANG_THAI_DA_THANH_TOAN);
            managed.setTongTien(hoaDonDto.getTongTien());
            if (hoaDonDto.getNgayTao() != null) managed.setNgayTao(hoaDonDto.getNgayTao());
            if (hoaDonDto.getPhuongThucTT() != null) managed.setPhuongThucTT(hoaDonDto.getPhuongThucTT());
            tr.commit();
            return true;
        } catch (Exception e) {
            if (tr.isActive()) tr.rollback();
            e.printStackTrace();
            return false;
        } finally {
            em.close();
        }
    }

    @Override
    public ThongKeDTO getThongKe(java.time.LocalDate fromDate, java.time.LocalDate toDate) {
        List<HoaDon> allInvoices = hoaDonDao.findByDateRange(fromDate, toDate);
        List<HoaDon> paidInvoices = allInvoices.stream()
                .filter(h -> TRANG_THAI_DA_THANH_TOAN.equals(h.getTrangThai()))
                .collect(Collectors.toList());

        double tongDoanhThu = paidInvoices.stream()
                .mapToDouble(h -> h.getTongTien() != null ? h.getTongTien() : 0.0).sum();
        int tongHoaDon = paidInvoices.size();
        double doanhThuTrungBinh = tongHoaDon > 0 ? tongDoanhThu / tongHoaDon : 0.0;

        long daySpan = java.time.temporal.ChronoUnit.DAYS.between(fromDate, toDate) + 1;
        Map<String, Double> doanhThuTheoNgay;

        if (daySpan <= 31) {
            doanhThuTheoNgay = new LinkedHashMap<>();
            java.time.LocalDate d = fromDate;
            DateTimeFormatter dayFmt = DateTimeFormatter.ofPattern("dd/MM");
            while (!d.isAfter(toDate)) {
                doanhThuTheoNgay.put(d.format(dayFmt), 0.0);
                d = d.plusDays(1);
            }
            for (HoaDon hd : paidInvoices) {
                if (hd.getNgayTao() != null) {
                    String key = hd.getNgayTao().format(dayFmt);
                    doanhThuTheoNgay.computeIfPresent(key, (k, v) -> v + (hd.getTongTien() != null ? hd.getTongTien() : 0.0));
                }
            }
        } else {
            doanhThuTheoNgay = new LinkedHashMap<>();
            for (int m = 1; m <= 12; m++) doanhThuTheoNgay.put(String.format("Tháng %02d", m), 0.0);
            for (HoaDon hd : paidInvoices) {
                if (hd.getNgayTao() == null) continue;
                String key = String.format("Tháng %02d", hd.getNgayTao().getMonthValue());
                doanhThuTheoNgay.merge(key, hd.getTongTien() != null ? hd.getTongTien() : 0.0, Double::sum);
            }
        }

        Map<String, ThongKeDoUongDTO> monBanChayMap = new LinkedHashMap<>();
        for (HoaDon hd : paidInvoices) {
            if (hd.getChiTietHoaDons() == null) continue;
            for (entity.ChiTietHoaDon ct : hd.getChiTietHoaDons()) {
                if (ct.getDoUong() == null) continue;
                String ma = ct.getDoUong().getMaDoUong();
                ThongKeDoUongDTO tkDU = monBanChayMap.computeIfAbsent(ma, k -> {
                    ThongKeDoUongDTO dto = new ThongKeDoUongDTO();
                    dto.setMaDoUong(ma);
                    dto.setTenDoUong(ct.getDoUong().getTenDoUong());
                    dto.setLoaiDoUong(ct.getDoUong().getLoaiDoUong());
                    dto.setSoLuongDaBan(0); dto.setDoanhThu(0.0);
                    return dto;
                });
                tkDU.setSoLuongDaBan(tkDU.getSoLuongDaBan() + ct.getSoLuong());
                tkDU.setDoanhThu(tkDU.getDoanhThu() + ct.getSoLuong() * ct.getDonGia());
            }
        }

        List<ThongKeDoUongDTO> topMonBanChay = monBanChayMap.values().stream()
                .sorted(Comparator.comparingInt(ThongKeDoUongDTO::getSoLuongDaBan).reversed())
                .limit(10).collect(Collectors.toList());

        return ThongKeDTO.builder()
                .tongDoanhThu(tongDoanhThu).tongHoaDon(tongHoaDon)
                .doanhThuTrungBinhMoiDon(doanhThuTrungBinh).tongBanDaPhucVu(0)
                .doanhThuTheoNgay(doanhThuTheoNgay).topMonBanChay(topMonBanChay).build();
    }
}
