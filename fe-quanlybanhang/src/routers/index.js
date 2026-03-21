// ===== PAGE =====
//Public pages
import LoginPage from "../pages/LoginPage";
import NotifyPage from "../pages/NotifyPage";
import ScanQrPage from "../pages/ScanQrPage";
import MomoCallback from "../pages/MomoCallback";
import MomoCallback_Takeaway from "../pages/MomoCallback_Takeaway";
import ChonMon from "../pages/KH_ChonMon";
import GioHang from "../pages/GioHang";
import KH_XemDonHang from "../pages/KH_XemDonHang";
import OrderStatus from "../components/ChucNang/OrderStatus";

//Kitchen pages
import Bep_NhanDon from "../pages/Bep_NhanDon";

//Cashier pages
import NV_XemTrangThaiBan from "../pages/NV_XemTrangThaiBan";

// ===== LAYOUTS =====
import { LoginLayout, MainLayout } from "../components/Layouts";




const cashierRoutes = [
    { path: '/login', component: LoginPage, layout: LoginLayout },
    { path: '/nhanvien/xemtrangthaiban', component: NV_XemTrangThaiBan, layout: MainLayout},
    { path: '/momo/callback-takeaway', component: MomoCallback_Takeaway, },
]

const managerRoutes = [
    { path: '/login', component: LoginPage, layout: LoginLayout },
    // { path: '/quanly/thongke', component: QL_ThongKe, },
    // { path: '/quanly/donhang', component: QL_DonHang, },
    // { path: '/quanly/thongke', component: QL_ThongKe, },
    // { path: '/quanly/xemdanhgia', component: QL_XemDanhGia, },
    // { path: '/quanly/taikhoan', component: QL_TaiKhoan, },
    // { path: '/quanly/sanpham', component: QL_SanPham, },
    // { path: '/quanly/loaisanpham', component: QL_LoaiSanPham, },
]

const kitchenRoutes = [
    { path: '/login', component: LoginPage, layout: LoginLayout },
    { path: '/bep/nhandon', component: Bep_NhanDon, layout: MainLayout },
]

// Public routes
const publicRoutes = [
    { path: '/', component: ScanQrPage, layout: MainLayout },
    { path: '/login', component: LoginPage, layout: LoginLayout },
    { path: '/notify', component: NotifyPage, },
    { path: '/auth/giohang', component: GioHang, },
    { path: '/xemDonHang', component: KH_XemDonHang, },
    { path: '/xemDonHang/:orderId', component: OrderStatus, },
    { path: '/menu/:tableId', component: ChonMon, },
    { path: '/momo/callback', component: MomoCallback, },
    
];


export { publicRoutes, kitchenRoutes, cashierRoutes, managerRoutes  };