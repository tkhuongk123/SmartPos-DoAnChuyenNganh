// ===== PAGE =====
// Public pages
import LoginPage from "../pages/LoginPage";
import NotifyPage from "../pages/NotifyPage";
import ScanQrPage from "../pages/ScanQrPage";
import MomoCallback from "../pages/MomoCallback";
import MomoCallback_Takeaway from "../pages/MomoCallback_Takeaway";
import ChonMon from "../pages/KH_ChonMon";
import GioHang from "../pages/GioHang";
import KH_XemDonHang from "../pages/KH_XemDonHang";
import OrderStatus from "../components/ChucNang/OrderStatus";

// Kitchen pages
import Bep_NhanDon from "../pages/Bep_NhanDon";

// Cashier pages
import NV_XemTrangThaiBan from "../pages/NV_XemTrangThaiBan";
import NV_XemDonHang from "../pages/NV_XemDonHang";

// Manager pages
import QL_Dashboard from "../pages/QL_Dashboard";
import QL_Food from "../pages/QL_Food";
import QL_FoodCategory from "../pages/QL_FoodCategory";
import QL_Ingredient from "../pages/QL_Ingredient";
import QL_Import from "../pages/QL_Import";
import QL_Supplier from "../pages/QL_Supplier";
import QL_Order from "../pages/QL_Order";
import QL_Staff from "../pages/QL_Staff";
import QL_Table from "../pages/QL_Table";
import QL_TableArea from "../pages/QL_TableArea";


// ===== LAYOUTS =====
import { LoginLayout, MainLayout } from "../components/Layouts";




const cashierRoutes = [
    { path: '/login', component: LoginPage, layout: LoginLayout },
    { path: '/nhanvien/xemtrangthaiban', component: NV_XemTrangThaiBan, layout: MainLayout},
    { path: '/nhanvien/xemdonhang', component: NV_XemDonHang, layout: MainLayout},
    { path: '/momo/callback-takeaway', component: MomoCallback_Takeaway, },
]

const managerRoutes = [
    { path: '/login', component: LoginPage, layout: LoginLayout },
    { path: '/quanly/dashboard', component: QL_Dashboard, },
    { path: '/quanly/food', component: QL_Food, },
    { path: '/quanly/food-category', component: QL_FoodCategory, },
    { path: '/quanly/import', component: QL_Import, },
    { path: '/quanly/supplier', component: QL_Supplier, },
    { path: '/quanly/order', component: QL_Order, },
    { path: '/quanly/staff', component: QL_Staff, },
    { path: '/quanly/table', component: QL_Table, },
    { path: '/quanly/table-area', component: QL_TableArea, }

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