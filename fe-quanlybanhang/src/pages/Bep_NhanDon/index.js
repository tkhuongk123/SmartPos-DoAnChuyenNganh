// FRAMEWORKS
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";

// COMPONENTS
import "./Bep_NhanDon.css";
import { SocketContext } from "../../context/SocketProvider";


// APIS
import { layDanhSach, updateOrderStatus } from "../../services/OrderAPI";
import { layChiTietTheoDon } from "../../services/OrderDetailAPI";
import { getTableById } from "../../services/TableAPI";
import { laySanPhamTheoId } from "../../services/FoodAPI";


/* ─── STATUS CONFIG ─────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  PENDING:   { label: "Chờ xác nhận", color: "#f59e0b", bg: "#fef3c7", next: "COOKING",  nextLabel: "Bắt đầu nấu" },
  COOKING:   { label: "Đang nấu",     color: "#3b82f6", bg: "#dbeafe", next: "COOKED",   nextLabel: "Hoàn thành" },
  COOKED:    { label: "Đã chế biến",  color: "#8b5cf6", bg: "#ede9fe", next: "SERVED",   nextLabel: "Báo nhận món" },
  SERVED:    { label: "Đã phục vụ",   color: "#10b981", bg: "#d1fae5", next: null,       nextLabel: null },
  TAKEAWAY:  { label: "Mang về",      color: "#0891b2", bg: "#cffafe", next: null,       nextLabel: null },
  CANCELLED: { label: "Đã huỷ",       color: "#ef4444", bg: "#fee2e2", next: null,       nextLabel: null },
};

const ALL_FILTERS = ["Tất cả", "Chờ xác nhận", "Đang nấu", "Đã chế biến", "Đã phục vụ", "Đã huỷ"];
const STATUS_BY_LABEL = Object.fromEntries(
  Object.entries(STATUS_CONFIG).map(([k, v]) => [v.label, k])
);

/* ─── HELPERS ───────────────────────────────────────────────────────── */
function fmt(dt) {
  const d = new Date(dt);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}
function fmtDate(dt) {
  return new Date(dt).toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
}
function totalOf(order) {
  return order.order_details.reduce((s, i) => s + i.quantity * i.price, 0);
}
function vnd(n) {
  return n.toLocaleString("vi-VN") + "đ";
}
function elapsed(dt) {
  const diff = Math.floor((Date.now() - new Date(dt)) / 60000);
  if (diff < 1) return "Vừa xong";
  return `${diff} phút trước`;
}

function Bep_NhanDon() {
  const socket = useContext(SocketContext);
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [toasts, setToasts] = useState([]);
  const [clock, setClock] = useState(new Date());

  /* live clock */
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      socket.emit("join_view_order_status");
      const orders = await layDanhSach();
      if (orders?.data) {
        const ordersContainOrderDetails = await Promise.all(
          orders.data.map(async (order) => {
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
            return {
              ...order,
              table_name: table?.data ? table?.data.table_name : "Mang về",
              order_details: orderDetailsContainFoodName,
            };
          })
        );
        setOrders(ordersContainOrderDetails);
      }
    })();
  }, []);


  useEffect(() => {
    if (!socket) return;
    socket.on("new_order", async (order) => {
      // lấy order_id từ socket
      const orderData = order.data;
      // gọi API lấy chi tiết order
      const orderDetails = await layChiTietTheoDon(orderData.order_id);
      let orderDetailsContainFoodName = [];

      if (orderDetails?.data) {
        orderDetailsContainFoodName = await Promise.all(
          orderDetails.data.map(async (order_detail) => {
            const food = await laySanPhamTheoId({ food_id: order_detail.food_id });

            return {
              ...order_detail,
              food_name: food?.data?.food_name || null
            };
          })
        );
      }

      const table = await getTableById(orderData.table_id);

      const newOrder = {
        ...orderData,
        table_name: table?.data ? table.data.table_name : "Mang về",
        order_details: orderDetailsContainFoodName
      };

      // thêm order mới vào state
      setOrders(prev => [newOrder, ...prev]);

      addToast(`🔔 Có đơn mới #${orderData.order_id}`, "info");

    });

    return () => socket.off("new_order");

  }, [socket]);

  /* toast helper */
  function addToast(msg, type = "default") {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }

  /* advance status */
  const advanceStatus = async (order, nextStatus) => {
    const updateOrderStatusCheck = await updateOrderStatus(order.order_id, nextStatus);
    if(updateOrderStatusCheck.isUpdated)
    {
      socket.emit("update_order_status", updateOrderStatusCheck.order);
    }
    setOrders(prev =>
      prev.map(o => o.order_id === order.order_id ? { ...o, order_status: nextStatus } : o)
    );
    const labels = { COOKING: "Bắt đầu nấu", COOKED: "Đã hoàn thành chế biến", SERVED: "Đã báo nhận món" };
    addToast(`Đơn #${order.order_id}: ${labels[nextStatus] || nextStatus}`,
      nextStatus === "SERVED" ? "success" : "info");
    setSelected(prev => prev ? { ...prev, order_status: nextStatus } : prev);
  }

  /* filter + search */
  const filtered = orders.filter(o => {
    const matchFilter =
      filter === "Tất cả" ||
      STATUS_CONFIG[o.order_status]?.label === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      String(o.order_id).includes(q) ||
      o.table_name.toLowerCase().includes(q) ||
      o.items.some(i => i.food_name.toLowerCase().includes(q));
    return matchFilter && matchSearch;
  });

  /* counts per status label */
  const counts = {};
  orders.forEach(o => {
    const lbl = STATUS_CONFIG[o.order_status]?.label;
    if (lbl) counts[lbl] = (counts[lbl] || 0) + 1;
  });
  const pendingCount = (counts["Chờ xác nhận"] || 0) + (counts["Đang nấu"] || 0);

  const sel = selected
    ? orders.find(o => o.order_id === selected.order_id)
    : null;
  

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-logo">Smart<span>POS</span></div>
        <div className="topbar-title">Màn hình bếp</div>
        <div className="topbar-divider" />
        {pendingCount > 0 && (
          <div className="topbar-badge">⚡ {pendingCount} món cần xử lý</div>
        )}
        <div className="topbar-clock">
          {clock.toLocaleTimeString("vi-VN")} — {clock.toLocaleDateString("vi-VN")}
        </div>
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        {ALL_FILTERS.map(f => (
          <button
            key={f}
            className={`filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
            {f !== "Tất cả" && counts[f] ? ` (${counts[f]})` : ""}
            {f === "Tất cả" ? ` (${orders.length})` : ""}
          </button>
        ))}
      </div>

      {/* MAIN LAYOUT */}
      <div className="layout">

        {/* LEFT: ORDER LIST */}
        <div className="left-panel">
        
          {/* Search */}
          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="🔍  Tìm mã đơn, bàn, món ăn..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="order-list">
            {filtered.length === 0 && (
              <div className="list-empty">Không có đơn hàng nào</div>
            )}
            {filtered.map(order => {
              const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG[order.order_status];
              const isNew = order.order_status === "PENDING";
              return (
                <div
                  key={order.order_id}
                  className={`order-card${sel?.order_id === order.order_id ? " selected" : ""}`}
                  onClick={() => setSelected(order)}
                >
                  {isNew && <div className="new-dot" />}
                  <div className="order-card-header">
                    <div className="order-id">
                      #{order.order_id}
                      {order.order_method == "TAKEAWAY" ? <span className="order-method">Mang về</span> : ""}
                    </div>
                    <div className="order-time">{fmt(order.created_at)}</div>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <span
                      className="status-pill"
                      style={{ color: sc.color, background: sc.bg }}
                    >
                      {sc.label}
                    </span>
                  </div>
                  <div className="order-items-preview">
                    {order.order_details.map(i => `${i.quantity}× ${i.food_name}`).join(" · ")}
                  </div>
                  <div className="order-meta">
                    <div className="order-table">📍 {order.table_name}</div>
                    <div className="order-amount">{vnd(totalOf(order))}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: ORDER DETAIL */}
        <div className="right-panel">
          {!sel ? (
            <div className="detail-empty">
              <div className="detail-empty-icon">🍽️</div>
              <div className="detail-empty-text">Chọn một đơn hàng để xem chi tiết</div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="detail-header">
                <div className="detail-order-id">
                  Đơn #{sel.order_id}
                  {sel.order_method == "TAKEAWAY" ? <span>Mang về</span> : ""}
                </div>
                <div className="detail-meta">
                  <div>
                    <strong>Bàn:</strong> {sel.table_name}
                  </div>
                  <div>
                    <strong>Thời gian:</strong> {fmtDate(sel.created_at)} lúc {fmt(sel.created_at)}
                  </div>
                  <div>
                    <strong>Trạng thái:</strong>{" "}
                    <span style={{
                      color: STATUS_CONFIG[sel.order_status].color,
                      fontWeight: 700,
                    }}>
                      {STATUS_CONFIG[sel.order_status].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="items-section">
                <div className="section-title">Danh sách món ({sel.order_details.length} món)</div>

                {sel.order_details.map(item => (
                  <div className="item-row" key={item.order_detail_id}>
                    <div className="item-qty">{item.quantity}</div>
                    <div className="item-info">
                      <div className="item-name">{item.food_name}</div>
                      {item.note && <div className="item-note">📝 {item.note}</div>}
                    </div>
                    <div className="item-price">{vnd(item.quantity * item.price)}</div>
                  </div>
                ))}

                <div className="divider" />

                <div className="total-row">
                  <div className="total-label">Tổng cộng</div>
                  <div className="total-amount">{vnd(totalOf(sel))}</div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="action-bar">
                {sel.order_status === "PENDING" && (
                  <>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setOrders(prev =>
                          prev.map(o =>
                            o.order_id === sel.order_id
                              ? { ...o, order_status: "CANCELLED" }
                              : o
                          )
                        );
                        addToast(`Đơn #${sel.order_id} đã bị huỷ`, "default");
                        setSelected(null);
                      }}
                    >
                      ✕ Huỷ đơn
                    </button>
                    <button
                      className="btn btn-blue"
                      onClick={() => {
                        advanceStatus(sel, "COOKING");
                      }}
                    >
                      Bắt đầu nấu
                    </button>
                  </>
                )}

                {sel.order_status === "COOKING" && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      advanceStatus(sel, "COOKED");
                    }}
                  >
                    Hoàn thành chế biến
                  </button>
                )}

                {sel.order_status === "COOKED" && (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      advanceStatus(sel, "SERVED");
                    }}
                  >
                    Báo nhận món
                  </button>
                )}

                {(sel.order_status === "SERVED" || sel.order_status === "PAID" || sel.order_status === "CANCELLED") && (
                  <div style={{ color: "#475569", fontSize: 14, fontWeight: 600 }}>
                    {sel.order_status === "SERVED" && "Đã phục vụ – Không cần thao tác thêm"}
                    {sel.order_status === "PAID" && "Đã thanh toán"}
                    {sel.order_status === "CANCELLED" && "❌ Đơn đã bị huỷ"}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* TOASTS */}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </>
  );
}

export default Bep_NhanDon;
