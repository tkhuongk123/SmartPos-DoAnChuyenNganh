// FRAMEWORKS
import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";

// COMPONENTS
import "./OrderStatus.css";
import TimelineStep from "./TimelineStep";
import { SocketContext } from "../../../context/SocketProvider";



// APIS
import { layDonHangTheoId } from "../../../services/OrderAPI";
import { layChiTietTheoDon } from "../../../services/OrderDetailAPI";
import { laySanPhamTheoId } from "../../../services/FoodAPI";
import { getTableById, getTableAreaByTableId } from "../../../services/TableAPI";



const ORDER_STATUSES = [
  { key: "PENDING",  label: "Đặt món ăn thành công",   sublabel: "Đơn hàng đã được ghi nhận",      icon: "🛒", color: "#4CAF50", bg: "#E8F5E9", ring: "#A5D6A7" },
  { key: "COOKING",  label: "Đã xác nhận",            sublabel: "Bếp đang chuẩn bị món ăn",       icon: "✅", color: "#2196F3", bg: "#E3F2FD", ring: "#90CAF9" },
  { key: "COOKED",   label: "Đã làm xong",            sublabel: "Món ăn đã sẵn sàng phục vụ",     icon: "🍽️", color: "#FF9800", bg: "#FFF3E0", ring: "#FFCC80" },
  { key: "SERVED",     label: "Đã phục vụ món ăn ",  sublabel: "Cảm ơn quý khách!",              icon: "🎉", color: "#00BCD4", bg: "#E0F7FA", ring: "#80DEEA" },
//   { key: "PAID",   label: "Đã phục vụ",         sublabel: "Vui lòng thanh toán tại quầy",   icon: "💰", color: "#9C27B0", bg: "#F3E5F5", ring: "#CE93D8" },
  { key: "CANCELLED",label: "Đã huỷ",                 sublabel: "Đơn hàng bị huỷ",                icon: "❌", color: "#F44336", bg: "#FFEBEE", ring: "#EF9A9A" },
];



const STATUS_ORDER = ["PENDING", "COOKING", "COOKED", "SERVED", "PAID"];
const STATUS_MAP = Object.fromEntries(ORDER_STATUSES.map(s => [s.key, s]));



function OrderStatus() {
    const { orderId } = useParams();
    const socket = useContext(SocketContext);
    const [order, setOrder] = useState(null);
    const [animating, setAnimating]         = useState(false);
    const [activeTab, setActiveTab]         = useState("status");
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [currentStep, setCurrentStep] = useState(STATUS_MAP["PENDING"]);
    const [displayStatuses, setDisplayStatuses] = useState([]);

 

    // useEffects
    useEffect(() => {
        (async () => {
          socket.emit("join_view_order_status");
          const order = await layDonHangTheoId(orderId);
          if(order.data)
          {
            setCurrentIndex(STATUS_ORDER.indexOf(order.data.order_status));
            setCurrentStep(STATUS_MAP[order.data.order_status]);
            const displayStatuses = order.data.order_status === "CANCELLED"
                ? ORDER_STATUSES.filter(s => s.key !== "CANCELLED").concat(STATUS_MAP["CANCELLED"])
                : ORDER_STATUSES.filter(s => s.key !== "CANCELLED");
            setDisplayStatuses(displayStatuses);

            const orderDetails = await layChiTietTheoDon(order.data.order_id);
            let orderDetailsContainFoodName = [];
            if(orderDetails.data)
            {
              orderDetailsContainFoodName = await Promise.all(
                orderDetails.data.map(async (order_detail) => {
                  const food = await laySanPhamTheoId({food_id: order_detail.food_id});
                  return {
                    ...order_detail,
                    food_name: food?.data.food_name || null
                  }
                })
              )
            }
            const table = await getTableById(order.data.table_id);
            const tableArea = await getTableAreaByTableId(order.data.table_id);
            
            const ordersContainOrderDetails = {
                ...order.data,
                order_details: orderDetailsContainFoodName,
                table_name: table?.data.table_name || "",
                table_area_name: tableArea?.data.table_area_name || "",
            };
            setOrder(ordersContainOrderDetails);

          }
        })();
    }, []);

    useEffect(() => {
        if (!socket) return;
        
        const handler = async (order) => {
            if(order)
            {
                setCurrentIndex(STATUS_ORDER.indexOf(order.order_status));
                setCurrentStep(STATUS_MAP[order.order_status]);
                const displayStatuses = order.order_status === "CANCELLED"
                    ? ORDER_STATUSES.filter(s => s.key !== "CANCELLED").concat(STATUS_MAP["CANCELLED"])
                    : ORDER_STATUSES.filter(s => s.key !== "CANCELLED");
                setDisplayStatuses(displayStatuses);

                const orderDetails = await layChiTietTheoDon(order.order_id);
                let orderDetailsContainFoodName = [];
                if(orderDetails.data)
                {
                    orderDetailsContainFoodName = await Promise.all(
                    orderDetails.data.map(async (order_detail) => {
                        const food = await laySanPhamTheoId({food_id: order_detail.food_id});
                        return {
                        ...order_detail,
                        food_name: food?.data.food_name || null
                        }
                    })
                    )
                }
                const table = await getTableById(order.table_id);
                const tableArea = await getTableAreaByTableId(order.table_id);
                
                const ordersContainOrderDetails = {
                    ...order,
                    order_details: orderDetailsContainFoodName,
                    table_name: table?.data ? table.data.table_name : "Mang về",
                    table_area_name: tableArea?.data ? tableArea.data.table_area_name : "",
                };
                setOrder(ordersContainOrderDetails);
            }
        }
        socket.on("update_order_status", handler);

        return () => {
            socket.off("update_order_status", handler);
        };

    }, [socket]);

    

    // Helpers
    function formatCurrency(n) {
        return n.toLocaleString("vi-VN") + "đ";
    }

    if (!order) {
        return <div className="loading">⏳ Đang tải đơn hàng...</div>;
    }
    
    return (
        <div className="kh-order-info-wrapper slide-in">
            {/* Header */}
            <div className="header">
                {/* <button className="os-back-btn" onClick={onBack}>←</button> */}
                <div style={{ flex: 1 }}>
                <div className="header-title">Đơn hàng: {order.order_id}</div>
                <div className="header-subtitle">
                    {order.order_method === "DINE_IN"
                    ? `${order.table_area_name ? order.table_area_name + " · " : ""}${order.table_name}`
                    : "Mang về"
                    } · Smart POS
                </div>
                </div>
            </div>
        
            {/* Tabs */}
            <div className="tabs">
                <div className={`tab ${activeTab === "info" ? "active" : ""}`}    onClick={() => setActiveTab("info")}>Thông tin đơn hàng</div>
                <div className={`tab ${activeTab === "status" ? "active" : ""}`}  onClick={() => setActiveTab("status")}>Trạng thái</div>
            </div>
        
            {activeTab === "info" ? (
                /* ── Info Tab ── */
                <div className="tab-content">
                    <div className="info-card">
                        <div className="info-row">
                            <span className="info-label">Mã đơn</span>
                            <span className="info-val bold">{order.order_id}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Vị trí</span>
                            <span className="info-val">
                                {order.order_method === "DINE_IN"
                                ? `${order.table_name} ${order.table_area_name ? ` (${order.table_area_name})` : ""}`
                                : "Mang về"}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Hình thức</span>
                            <span className={`method-badge ${order.order_method === "DINE_IN" ? "dine" : "take"}`}>
                                {order.order_method === "DINE_IN" ? "🪑 Tại bàn" : "🛵 Mang về"}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Thời gian</span>
                            <span className="info-val">
                                {new Date(order.created_at).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </span>
                        </div>
                    </div>
            
                    <div className="items-card">
                        <div className="items-title">🧾 Danh sách món</div>
                        {order.order_details.map((item, i) => (
                            <div key={i} className="item-row">
                                <span className="item-name">{item.food_name}</span>
                                <span className="item-qty">x{item.quantity}</span>
                                <span className="item-price">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="item-total-row">
                            <span>Tổng cộng</span>
                            <span className="item-total">{formatCurrency(order.total_amount || order.items.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
                        </div>
                    </div>
                </div>
            ) : (
                /* ── Status Tab ── */
                <div className="tab-content">
                {/* Banner */}
                <div
                    className="status-banner"
                    style={{
                        background: currentStep.bg,
                        transform: animating ? "scale(0.97)" : "scale(1)",
                        transition: "all 0.35s ease",
                    }}
                >
                    <span className="banner-icon">{currentStep.icon}</span>
                    <div>
                    <div className="banner-label" style={{ color: currentStep.color }}>{currentStep.label}</div>
                    <div className="banner-sublabel">{currentStep.sublabel}</div>
                    </div>
                </div>
        
                {/* Timeline */}
                <div className="section-card">
                    <div className="section-header">
                    <span className="section-title">📋 Tiến trình đơn hàng</span>
                    <span className="step-count">
                        {order.order_status === "CANCELLED" ? "Huỷ" : `${Math.max(currentIndex, 0) + 1} / ${STATUS_ORDER.length - 1}`}
                    </span>
                    </div>
                    <div className="timeline">
                        {[...displayStatuses].reverse().map((step, revIdx) => {
                            const totalLen = displayStatuses.length;
                            const index    = totalLen - 1 - revIdx;
                            const stepIdx  = STATUS_ORDER.indexOf(step.key);
                            return (
                            <TimelineStep
                                key={step.key}
                                step={step}
                                index={order.order_status === "CANCELLED" ? (step.key === "CANCELLED" ? currentIndex : index) : index}
                                currentIndex={currentIndex}
                                isLast={revIdx === totalLen - 1}
                            />
                            );
                        })}

                    </div>
                </div>
            </div>
            )}
        
            {/* Celebration */}
            {order.order_status === "SERVED" ? (
                <div className="celebration">
                {["🎉","⭐","🥳","✨","🎊","💫"].map((e, i) => (
                    <span key={i} className="confetti-emoji" style={{ left: `${10 + i * 15}%`, animationDelay: `${i * 0.25}s`, fontSize: `${20 + (i % 3) * 8}px` }}>{e}</span>
                ))}
                </div>
            ) : ""
            }
        </div>
    )
}

export default OrderStatus;
