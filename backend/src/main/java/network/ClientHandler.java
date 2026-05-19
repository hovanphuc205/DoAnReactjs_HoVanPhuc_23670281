package network;

import dto.*;
import mapper.Mapper;
import service.*;
import service.impl.*;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.Socket;
import java.time.LocalDate;
import java.util.List;

public class ClientHandler implements Runnable {
    private Socket socket;
    private String currentAccountId;

    private final HoaDonService hoaDonService = new HoaDonServiceImpl();
    private final DoUongService doUongService = new DoUongServiceImpl();
    private final TaiKhoanService taiKhoanService = new TaiKhoanServiceImpl();

    public ClientHandler(Socket socket) { this.socket = socket; }

    @Override
    public void run() {
        try (
            ObjectOutputStream out = new ObjectOutputStream(socket.getOutputStream());
            ObjectInputStream in = new ObjectInputStream(socket.getInputStream())
        ) {
            while (true) {
                Request req = (Request) in.readObject();
                Response res = processRequest(req);
                out.writeObject(res);
                out.flush();
            }
        } catch (Exception e) {
            System.out.println("Client disconnected: " + e.getMessage());
        } finally {
            if (currentAccountId != null) {
                taiKhoanService.updateStatus(currentAccountId, "Ngoại tuyến");
            }
            try { if (socket != null && !socket.isClosed()) socket.close(); } catch (Exception e) { e.printStackTrace(); }
        }
    }

    private Response processRequest(Request req) {
        Response response = new Response();
        try {
            switch (req.getCommandType()) {
                case LOGIN:
                    try {
                        TaiKhoanDTO loginDto = Mapper.map(req.getData(), TaiKhoanDTO.class);
                        TaiKhoanDTO result = taiKhoanService.login(loginDto.getTenDangNhap(), loginDto.getMatKhau());
                        if (result != null) {
                            if ("ALREADY_LOGGED_IN".equals(result.getMaTaiKhoan())) {
                                response.setSuccess(false);
                                response.setMessage("Tài khoản này đang được đăng nhập ở một nơi khác!");
                            } else {
                                this.currentAccountId = result.getMaTaiKhoan();
                                response.setSuccess(true);
                                response.setData(result);
                            }
                        } else {
                            response.setSuccess(false);
                            response.setMessage("Sai tên đăng nhập hoặc mật khẩu!");
                        }
                    } catch (Exception e) {
                        response.setSuccess(false);
                        response.setMessage("Lỗi đăng nhập: " + e.getMessage());
                    }
                    break;

                case GET_MENU:
                    response.setData(doUongService.getAllDrinks());
                    response.setSuccess(true);
                    break;

                case MANAGE_MENU_ADD:
                    try {
                        DoUongDTO dDto = Mapper.map(req.getData(), DoUongDTO.class);
                        boolean ok = doUongService.addDrink(dDto);
                        response.setSuccess(ok);
                        response.setMessage(ok ? "Thêm món thành công!" : "Mã món đã tồn tại!");
                    } catch (Exception e) { response.setSuccess(false); response.setMessage(e.getMessage()); }
                    break;

                case MANAGE_MENU_UPDATE:
                    try {
                        DoUongDTO dDto = Mapper.map(req.getData(), DoUongDTO.class);
                        boolean ok = doUongService.updateDrink(dDto);
                        response.setSuccess(ok);
                        response.setMessage(ok ? "Cập nhật thành công!" : "Lỗi!");
                    } catch (Exception e) { response.setSuccess(false); response.setMessage(e.getMessage()); }
                    break;

                case MANAGE_MENU_DELETE:
                    String maMonToDelete = Mapper.map(req.getData(), String.class);
                    boolean delOk = doUongService.deleteDrink(maMonToDelete);
                    response.setSuccess(delOk);
                    response.setMessage(delOk ? "Xóa món thành công!" : "Xóa món thất bại!");
                    break;

                case GET_INVOICES:
                    response.setData(hoaDonService.getAllInvoices());
                    response.setSuccess(true);
                    break;

                case ORDER_FOOD:
                    try {
                        Object[] orderData = (Object[]) req.getData();
                        HoaDonDTO phieuDto = Mapper.map(orderData[0], HoaDonDTO.class);
                        @SuppressWarnings("unchecked")
                        List<Object> cartData = (List<Object>) orderData[1];
                        List<ChiTietHoaDonDTO> cartDto = cartData.stream()
                                .map(c -> Mapper.map(c, ChiTietHoaDonDTO.class)).toList();
                        boolean ok = hoaDonService.handleOrderFood(phieuDto, cartDto);
                        response.setSuccess(ok);
                        response.setMessage(ok ? "Tạo đơn hàng thành công!" : "Lỗi tạo đơn hàng!");
                    } catch (Exception e) {
                        response.setSuccess(false);
                        response.setMessage("Lỗi Order: " + e.getMessage());
                    }
                    break;

                case PAY_BILL:
                    try {
                        HoaDonDTO hoaDonDto = Mapper.map(req.getData(), HoaDonDTO.class);
                        boolean ok = hoaDonService.handlePayment(hoaDonDto);
                        response.setSuccess(ok);
                        response.setMessage(ok ? "Thanh toán thành công!" : "Lỗi thanh toán!");
                    } catch (Exception e) { response.setSuccess(false); response.setMessage("Lỗi: " + e.getMessage()); }
                    break;

                case CHANGE_PASSWORD:
                    try {
                        Object[] pwData = (Object[]) req.getData();
                        String maTK = Mapper.map(pwData[0], String.class);
                        String oldPw = Mapper.map(pwData[1], String.class);
                        String newPw = Mapper.map(pwData[2], String.class);
                        boolean ok = taiKhoanService.changePassword(maTK, oldPw, newPw);
                        response.setSuccess(ok);
                        response.setMessage(ok ? "Đổi mật khẩu thành công!" : "Mật khẩu cũ không đúng!");
                    } catch (Exception e) { response.setSuccess(false); response.setMessage("Lỗi: " + e.getMessage()); }
                    break;

                case GENERATE_ID:
                    String type = Mapper.map(req.getData(), String.class);
                    String generatedId = "";
                    if ("HOA_DON".equals(type)) generatedId = util.IdGenerator.generateHoaDonId();
                    else if ("CTHD".equals(type)) generatedId = util.IdGenerator.generateChiTietHoaDonId();
                    else if ("TAI_KHOAN".equals(type)) generatedId = util.IdGenerator.generateTaiKhoanId();
                    else if ("DO_UONG".equals(type)) generatedId = util.IdGenerator.generateDoUongId();
                    response.setSuccess(true);
                    response.setData(generatedId);
                    break;

                case GET_THONG_KE:
                    try {
                        Object[] dateRange = (Object[]) req.getData();
                        LocalDate fromDate = Mapper.map(dateRange[0], LocalDate.class);
                        LocalDate toDate = Mapper.map(dateRange[1], LocalDate.class);
                        response.setSuccess(true);
                        response.setData(hoaDonService.getThongKe(fromDate, toDate));
                    } catch (Exception e) { response.setSuccess(false); response.setMessage("Lỗi thống kê: " + e.getMessage()); }
                    break;

                case LOGOUT:
                    if (currentAccountId != null) {
                        taiKhoanService.updateStatus(currentAccountId, "Ngoại tuyến");
                        this.currentAccountId = null;
                        response.setSuccess(true);
                        response.setMessage("Đăng xuất thành công.");
                    } else {
                        response.setSuccess(false);
                        response.setMessage("Không tìm thấy phiên đăng nhập.");
                    }
                    break;

                default:
                    response.setSuccess(false);
                    response.setMessage("Lệnh không được hỗ trợ.");
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setSuccess(false);
            response.setMessage("Lỗi Server: " + e.getMessage());
        }
        return response;
    }
}
