import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { layDanhSach, layDanhSachTheoNgay } from "../../services/OrderAPI";
import { tongSanPham } from "../../services/FoodAPI";
import "./QL_Dashboard.css";

function QL_Dashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        todaysOrders: 0,
        todaysRevenue: 0,
        loading: true,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [ordersRes, todayRes, productsRes] = await Promise.all([
                    layDanhSach(),
                    layDanhSachTheoNgay(),
                    tongSanPham(),
                ]);

                const orders = ordersRes?.data || [];
                const todayOrders = todayRes?.data || [];
                const totalRevenue = orders.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0);
                const todaysRevenue = todayOrders.reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0);
                const totalProducts = Number(productsRes?.tongSanPham ?? 0);
                const recent = [...orders]
                    .sort((a, b) => {
                        if (a.created_at && b.created_at) {
                            return new Date(b.created_at) - new Date(a.created_at);
                        }
                        return (b.order_id || 0) - (a.order_id || 0);
                    })
                    .slice(0, 5);

                setStats({
                    totalOrders: orders.length,
                    totalRevenue,
                    totalProducts,
                    todaysOrders: todayOrders.length,
                    todaysRevenue,
                    loading: false,
                });
                setRecentOrders(recent);
            } catch (fetchError) {
                console.error(fetchError);
                setError("Không thể tải thống kê. Vui lòng thử lại sau.");
                setStats((prev) => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    const getMethodText = (method) => {
        const map = {
            dine_in: "Tại chỗ",
            takeaway: "Mang về",
            delivery: "Giao hàng",
        };
        return map[method] || method || "-";
    };

    const getStatusTag = (status) => {
        const statusMap = {
            PENDING: { color: "gold", text: "Đang chờ" },
            COOKING: { color: "orange", text: "Đang nấu" },
            COOKED: { color: "blue", text: "Nấu xong" },
            SERVED: { color: "cyan", text: "Đã phục vụ" },
            PAID: { color: "green", text: "Đã thanh toán" },
            CANCELLED: { color: "red", text: "Hủy" },
        };
        const config = statusMap[status] || { color: "default", text: status || "-" };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
        {
            title: "STT",
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: "ID đơn hàng",
            dataIndex: "order_id",
            width: 100,
        },
        {
            title: "Phương thức",
            dataIndex: "order_method",
            render: getMethodText,
            width: 110,
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_amount",
            render: (amount) => formatCurrency(amount || 0),
            width: 130,
        },
        {
            title: "Trạng thái",
            dataIndex: "order_status",
            render: getStatusTag,
            width: 120,
        },
        {
            title: "Ngày tạo",
            dataIndex: "created_at",
            render: (value) => value ? new Date(value).toLocaleString("vi-VN") : "-",
            width: 180,
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            render: (_, record) => record.note || record.order_note || "-",
            ellipsis: true,
        },
    ];

    return (
        <main className="QL_Dashboard">
            <div className="QL_Dashboard__header">
                <h3>QL - Thống kê cơ bản</h3>
            </div>

            {stats.loading ? (
                <p className="QL_Dashboard__loading">Đang tải số liệu...</p>
            ) : error ? (
                <p className="QL_Dashboard__error">{error}</p>
            ) : (
                <>
                    <div className="QL_Dashboard__grid">
                        <div className="QL_Dashboard__card">
                            <h4 className="QL_Dashboard__cardTitle">Tổng sản phẩm</h4>
                            <p className="QL_Dashboard__value">{stats.totalProducts}</p>
                            <p className="QL_Dashboard__subtitle">Số lượng sản phẩm hiện có</p>
                        </div>

                        <div className="QL_Dashboard__card">
                            <h4 className="QL_Dashboard__cardTitle">Tổng đơn hàng</h4>
                            <p className="QL_Dashboard__value">{stats.totalOrders}</p>
                            <p className="QL_Dashboard__subtitle">Số đơn hàng trên toàn hệ thống</p>
                        </div>

                        <div className="QL_Dashboard__card">
                            <h4 className="QL_Dashboard__cardTitle">Tổng doanh thu</h4>
                            <p className="QL_Dashboard__value">{formatCurrency(stats.totalRevenue)}</p>
                            <p className="QL_Dashboard__subtitle">Tổng doanh thu từ tất cả đơn hàng</p>
                        </div>

                        <div className="QL_Dashboard__card">
                            <h4 className="QL_Dashboard__cardTitle">Đơn hàng hôm nay</h4>
                            <p className="QL_Dashboard__value">{stats.todaysOrders}</p>
                            <p className="QL_Dashboard__subtitle">Số đơn thanh toán trong ngày hiện tại</p>
                        </div>

                        <div className="QL_Dashboard__card">
                            <h4 className="QL_Dashboard__cardTitle">Doanh thu hôm nay</h4>
                            <p className="QL_Dashboard__value">{formatCurrency(stats.todaysRevenue)}</p>
                            <p className="QL_Dashboard__subtitle">Tổng doanh thu trong ngày hiện tại</p>
                        </div>
                    </div>

                    <div className="QL_Dashboard__recentOrders">
                        <div className="QL_Dashboard__recentHeader">
                            <h4>Đơn hàng gần đây</h4>
                            <p className="QL_Dashboard__recentSubtitle">Danh sách 5 đơn hàng mới nhất</p>
                        </div>
                        <Table
                            dataSource={recentOrders}
                            columns={columns}
                            rowKey="order_id"
                            pagination={false}
                            scroll={{ x: 900 }}
                        />
                    </div>
                </>
            )}
        </main>
    );
}

export default QL_Dashboard;
