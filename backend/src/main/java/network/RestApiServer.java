package network;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import dto.TaiKhoanDTO;
import dto.HoaDonDTO;
import dto.ChiTietHoaDonDTO;
import service.DoUongService;
import service.TaiKhoanService;
import service.HoaDonService;
import service.impl.DoUongServiceImpl;
import service.impl.TaiKhoanServiceImpl;
import service.impl.HoaDonServiceImpl;
import spark.Spark;

import java.time.LocalDate;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

public class RestApiServer {
    public static class OrderRequest {
        public String tenKhachHang;
        public String sdtKhachHang;
        public String diaChiGiaoHang;
        public String ghiChu;
        public String phuongThucTT;
        public Double tongTien;
        public List<ItemRequest> items;
    }

    public static class ItemRequest {
        public String maDoUong;
        public Integer soLuong;
        public Double donGia;
    }

    public static void main(String[] args) {
        // Khởi động server ở cổng 8080
        Spark.port(8080);
        
        // Khởi tạo các Service
        DoUongService doUongService = new DoUongServiceImpl();
        TaiKhoanService taiKhoanService = new TaiKhoanServiceImpl();
        HoaDonService hoaDonService = new HoaDonServiceImpl();
        
        // Khởi tạo Jackson ObjectMapper để parse JSON
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        // Bật CORS cho phép Frontend kết nối
        Spark.options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }
            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }
            return "OK";
        });

        Spark.before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            response.type("application/json");
        });
        
        // ================= ROUTES =================
        
        // 1. API Lấy danh sách đồ uống
        Spark.get("/api/drinks", (req, res) -> {
            return mapper.writeValueAsString(doUongService.getAllDrinks());
        });
        
        Spark.post("/api/drinks", (req, res) -> {
            try {
                dto.DoUongDTO dto = mapper.readValue(req.body(), dto.DoUongDTO.class);
                if (doUongService.addDrink(dto)) {
                    return "{\"message\": \"Thành công\"}";
                } else {
                    res.status(400);
                    return "{\"error\": \"Không thể thêm\"}";
                }
            } catch(Exception e) {
                res.status(500);
                return "{\"error\": \"Lỗi server\"}";
            }
        });

        Spark.put("/api/drinks", (req, res) -> {
            try {
                dto.DoUongDTO dto = mapper.readValue(req.body(), dto.DoUongDTO.class);
                if (doUongService.updateDrink(dto)) {
                    return "{\"message\": \"Thành công\"}";
                } else {
                    res.status(400);
                    return "{\"error\": \"Không thể sửa\"}";
                }
            } catch(Exception e) {
                res.status(500);
                return "{\"error\": \"Lỗi server\"}";
            }
        });

        Spark.delete("/api/drinks/:id", (req, res) -> {
            String id = req.params(":id");
            if (doUongService.deleteDrink(id)) {
                return "{\"message\": \"Thành công\"}";
            } else {
                res.status(400);
                return "{\"error\": \"Không thể xóa\"}";
            }
        });
        
        // 2. API Đăng nhập
        Spark.post("/api/login", (req, res) -> {
            try {
                // Parse body JSON từ React
                Map<String, String> body = mapper.readValue(req.body(), Map.class);
                String username = body.get("username");
                String password = body.get("password");
                
                TaiKhoanDTO tk = taiKhoanService.login(username, password);
                if (tk != null) {
                    if ("ALREADY_LOGGED_IN".equals(tk.getMaTaiKhoan())) {
                        res.status(403);
                        return "{\"error\": \"Tài khoản đang được đăng nhập ở nơi khác\"}";
                    }
                    return mapper.writeValueAsString(tk);
                } else {
                    res.status(401);
                    return "{\"error\": \"Sai tên đăng nhập hoặc mật khẩu\"}";
                }
            } catch (Exception e) {
                res.status(500);
                return "{\"error\": \"Lỗi máy chủ nội bộ\"}";
            }
        });

        // 3. API Đơn hàng
        Spark.get("/api/orders", (req, res) -> {
            try {
                return mapper.writeValueAsString(hoaDonService.getAllInvoices());
            } catch(Exception e) {
                res.status(500);
                return "{\"error\": \"" + e.getMessage() + "\"}";
            }
        });

        Spark.post("/api/orders", (req, res) -> {
            try {
                OrderRequest orderReq = mapper.readValue(req.body(), OrderRequest.class);
                HoaDonDTO phieuDto = new HoaDonDTO();
                phieuDto.setTenKhachHang(orderReq.tenKhachHang);
                phieuDto.setSdtKhachHang(orderReq.sdtKhachHang);
                phieuDto.setDiaChiGiaoHang(orderReq.diaChiGiaoHang);
                phieuDto.setGhiChu(orderReq.ghiChu);
                phieuDto.setPhuongThucTT(orderReq.phuongThucTT);
                phieuDto.setTongTien(orderReq.tongTien);
                phieuDto.setNgayTao(LocalDate.now());

                List<ChiTietHoaDonDTO> cartDto = new ArrayList<>();
                for (ItemRequest item : orderReq.items) {
                    ChiTietHoaDonDTO ct = new ChiTietHoaDonDTO();
                    ct.setSoLuong(item.soLuong);
                    ct.setDonGia(item.donGia);
                    
                    dto.DoUongDTO du = new dto.DoUongDTO();
                    du.setMaDoUong(item.maDoUong);
                    ct.setDoUong(du);
                    
                    cartDto.add(ct);
                }

                // E-commerce orders are paid upon checkout
                phieuDto.setTrangThai("Đã thanh toán");

                boolean success = hoaDonService.handleOrderFood(phieuDto, cartDto);
                if (success) {
                    return "{\"message\": \"Thành công\", \"maHoaDon\": \"" + phieuDto.getMaHoaDon() + "\"}";
                } else {
                    res.status(400);
                    return "{\"error\": \"Không thể tạo đơn hàng\"}";
                }
            } catch (Exception e) {
                res.status(500);
                e.printStackTrace();
                return "{\"error\": \"Lỗi server: " + e.getMessage() + "\"}";
            }
        });

        // 4. API Thống kê doanh thu
        Spark.get("/api/statistics", (req, res) -> {
            try {
                String filter = req.queryParams("filter");
                if (filter == null) {
                    filter = "Tháng";
                }
                
                LocalDate now = LocalDate.now();
                LocalDate fromDate = now;
                LocalDate toDate = now;
                
                if ("Ngày".equals(filter)) {
                    fromDate = now.minusDays(6);
                } else if ("Tuần".equals(filter)) {
                    fromDate = now.minusWeeks(3); // 4 weeks total
                } else if ("Tháng".equals(filter)) {
                    fromDate = now.withDayOfYear(1); // from Jan 1
                    toDate = now.withDayOfYear(now.lengthOfYear()); // to Dec 31
                } else if ("Năm".equals(filter)) {
                    fromDate = now.minusYears(4);
                }
                
                // Lấy tất cả hoá đơn trong khoảng thời gian
                List<dto.HoaDonDTO> invoices = hoaDonService.findInvoicesByDateRange(fromDate, toDate);
                
                // Khởi tạo map kết quả
                java.util.Map<String, Double> chartData = new java.util.LinkedHashMap<>();
                
                if ("Ngày".equals(filter)) {
                    for (int i = 6; i >= 0; i--) {
                        LocalDate d = now.minusDays(i);
                        String key = String.format("%02d/%02d", d.getDayOfMonth(), d.getMonthValue());
                        chartData.put(key, 0.0);
                    }
                    for (dto.HoaDonDTO hd : invoices) {
                        if (hd.getNgayTao() != null && "Đã thanh toán".equals(hd.getTrangThai())) {
                            String key = String.format("%02d/%02d", hd.getNgayTao().getDayOfMonth(), hd.getNgayTao().getMonthValue());
                            if (chartData.containsKey(key)) {
                                chartData.put(key, chartData.get(key) + (hd.getTongTien() != null ? hd.getTongTien() : 0.0));
                            }
                        }
                    }
                } else if ("Tuần".equals(filter)) {
                    for (int i = 3; i >= 0; i--) {
                        chartData.put("Tuần " + (4 - i), 0.0);
                    }
                    for (dto.HoaDonDTO hd : invoices) {
                        if (hd.getNgayTao() != null && "Đã thanh toán".equals(hd.getTrangThai())) {
                            long daysDiff = java.time.temporal.ChronoUnit.DAYS.between(hd.getNgayTao(), now);
                            int weekNum = (int) (daysDiff / 7);
                            if (weekNum >= 0 && weekNum <= 3) {
                                String key = "Tuần " + (4 - weekNum);
                                if (chartData.containsKey(key)) {
                                    chartData.put(key, chartData.get(key) + (hd.getTongTien() != null ? hd.getTongTien() : 0.0));
                                }
                            }
                        }
                    }
                } else if ("Tháng".equals(filter)) {
                    for (int m = 1; m <= 12; m++) {
                        chartData.put(String.format("T%02d", m), 0.0);
                    }
                    for (dto.HoaDonDTO hd : invoices) {
                        if (hd.getNgayTao() != null && "Đã thanh toán".equals(hd.getTrangThai()) && hd.getNgayTao().getYear() == now.getYear()) {
                            String key = String.format("T%02d", hd.getNgayTao().getMonthValue());
                            if (chartData.containsKey(key)) {
                                chartData.put(key, chartData.get(key) + (hd.getTongTien() != null ? hd.getTongTien() : 0.0));
                            }
                        }
                    }
                } else { // Năm
                    for (int i = 4; i >= 0; i--) {
                        chartData.put(String.valueOf(now.getYear() - i), 0.0);
                    }
                    for (dto.HoaDonDTO hd : invoices) {
                        if (hd.getNgayTao() != null && "Đã thanh toán".equals(hd.getTrangThai())) {
                            String key = String.valueOf(hd.getNgayTao().getYear());
                            if (chartData.containsKey(key)) {
                                chartData.put(key, chartData.get(key) + (hd.getTongTien() != null ? hd.getTongTien() : 0.0));
                            }
                        }
                    }
                }
                
                // Tính các chỉ số tổng quan
                double tongDoanhThu = 0.0;
                int tongHoaDon = 0;
                int productsSold = 0;
                java.util.Set<String> uniqueCustomers = new java.util.HashSet<>();
                
                List<dto.HoaDonDTO> allInvoices = hoaDonService.getAllInvoices();
                for (dto.HoaDonDTO hd : allInvoices) {
                    if ("Đã thanh toán".equals(hd.getTrangThai())) {
                        tongDoanhThu += (hd.getTongTien() != null ? hd.getTongTien() : 0.0);
                        tongHoaDon++;
                        if (hd.getSdtKhachHang() != null) {
                            uniqueCustomers.add(hd.getSdtKhachHang());
                        }
                        if (hd.getChiTietHoaDons() != null) {
                            for (dto.ChiTietHoaDonDTO ct : hd.getChiTietHoaDons()) {
                                productsSold += ct.getSoLuong();
                            }
                        }
                    }
                }
                
                java.util.Map<String, Object> result = new java.util.HashMap<>();
                result.put("tongDoanhThu", tongDoanhThu);
                result.put("tongHoaDon", tongHoaDon);
                result.put("productsSold", productsSold);
                result.put("uniqueCustomers", uniqueCustomers.size());
                
                List<Map<String, Object>> chartArray = new ArrayList<>();
                for (Map.Entry<String, Double> entry : chartData.entrySet()) {
                    Map<String, Object> point = new java.util.HashMap<>();
                    point.put("label", entry.getKey());
                    point.put("revenue", entry.getValue());
                    chartArray.add(point);
                }
                result.put("chartData", chartArray);
                
                return mapper.writeValueAsString(result);
            } catch (Exception e) {
                res.status(500);
                e.printStackTrace();
                return "{\"error\": \"Lỗi thống kê: " + e.getMessage() + "\"}";
            }
        });
        
        System.out.println("=================================================");
        System.out.println("REST API Server is running on http://localhost:8080");
        System.out.println("Try opening: http://localhost:8080/api/drinks");
        System.out.println("=================================================");
    }
}
