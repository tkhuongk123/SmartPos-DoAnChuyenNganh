// FRAMEWORKS


// COMPONENTS
import "./OrderCard.css";


// APIS


// CONTANTS
const ORDER_STATUSES = [
  { key: "PENDING",  label: "Đặt món ăn thành công",    sublabel: "Đơn hàng đã được ghi nhận",      icon: "🛒", color: "#4CAF50", bg: "#E8F5E9", ring: "#A5D6A7" },
  { key: "COOKING",  label: "Đang chế biến",            sublabel: "Bếp đang chuẩn bị món ăn",       icon: "✅", color: "#2196F3", bg: "#E3F2FD", ring: "#90CAF9" },
  { key: "COOKED",   label: "Đã làm xong",              sublabel: "Món ăn đã sẵn sàng phục vụ",     icon: "🍽️", color: "#FF9800", bg: "#FFF3E0", ring: "#FFCC80" },
  { key: "SERVED",   label: "Đã phục vụ",               sublabel: "Vui lòng thanh toán tại quầy",   icon: "💰", color: "#9C27B0", bg: "#F3E5F5", ring: "#CE93D8" },
  { key: "PAID",     label: "Thanh toán thành công",    sublabel: "Cảm ơn quý khách!",              icon: "🎉", color: "#00BCD4", bg: "#E0F7FA", ring: "#80DEEA" },
  { key: "CANCELLED",label: "Đã huỷ",                   sublabel: "Đơn hàng bị huỷ",                icon: "❌", color: "#F44336", bg: "#FFEBEE", ring: "#EF9A9A" },
];
 
const STATUS_ORDER = ["PENDING", "COOKING", "COOKED", "SERVED", "PAID"];
 
const STATUS_MAP = Object.fromEntries(ORDER_STATUSES.map(s => [s.key, s]));

function OrderCard({ order, onClick }) {
    const status = STATUS_MAP[order.order_status];


    // Helpers
    function formatCurrency(n) {
        return n.toLocaleString("vi-VN") + "đ";
    }

    function timeAgo(date) {
        const d = new Date(date);
        const mins = Math.floor((Date.now() - d.getTime()) / 60000);

        if (mins < 1) return "Vừa xong";
        if (mins < 60) return `${mins} phút trước`;
        return `${Math.floor(mins / 60)} giờ trước`;
    }

    return (
        <div className="kh-order-card" onClick={onClick}>
            <div className="order-card-top">
                <div className="order-card-left">
                    <div className="order-card-code"># {order.order_id}</div>
                    <div className="order-card-location">
                        {order.order_method === "DINE_IN"
                        ? `🪑 ${order.table_name}${order.table_area ? ` · ${order.table_area}` : ""}`
                        : "🛵 Mang về"}
                    </div>
                </div>
                <div className="order-card-right">
                    <div
                        className="order-status-pill"
                        style={{ background: status.bg, color: status.color, border: `1px solid ${status.ring}` }}
                    >
                        {status.icon} {status.label}
                    </div>
                </div>
            </div>
        
            <div className="order-card-divider" />
        
            <div className="order-card-bottom">
                <div className="order-card-items">
                    {order.order_details.slice(0, 2).map((item, i) => (
                        <span key={i} className="item-chip">{item.food_name} x{item.quantity}</span>
                    ))}
                    {order.order_details.length > 2 && (
                        <span className="item-chip muted">+{order.order_details.length - 2} món</span>
                    )}
                </div>
                <div className="order-card-meta">
                    <span className="order-time">{timeAgo(order.created_at)}</span>
                    <span className="order-amount">{formatCurrency(order.total_amount)}</span>
                </div>
            </div>
        </div>
    )
}

export default OrderCard;
