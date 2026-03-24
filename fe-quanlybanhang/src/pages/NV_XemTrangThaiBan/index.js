// FRAMEWORKS
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// COMPONENTS
import "./NV_XemTrangThaiBan.css";
import { layDs } from "../../services/FoodCategoryAPI";
import { layDsSanPham } from "../../services/FoodAPI";
import { SocketContext } from "../../context/SocketProvider";

// APIS
import { api } from "../../services/config";
import { thanhToan } from "../../services/PaymentAPI";
import { NotifyError } from "../../components/components/Toast";
import { getAreas, getTables, updateTableStatus } from "../../services/TableAPI";





/* ─── HELPERS ──────────────────────────────────────────────────────── */
const vnd = n => n.toLocaleString("vi-VN") + "đ";
const now = () => new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

/* ─── MAIN COMPONENT ────────────────────────────────────────────── */
function NV_XemTrangThaiBan() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [tables, setTables] = useState([]);
  const [areaTablesFiltered, setAreaTablesFiltered] = useState([]);
  const [foodCategories, setFoodCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [activeArea, setActiveArea] = useState(1);
  const [selectedTable, setSelectedTable] = useState(null); 
  const [orderTable, setOrderTable] = useState(null);        
  const [activeCat, setActiveCat] = useState(1);
  const [foodSearch, setFoodSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [note, setNote] = useState("");
  const [foodTarget, setFoodTarget] = useState(null); 
  const [payModal, setPayModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [clock, setClock] = useState(new Date());
  const [tableOpenTimes, setTableOpenTimes] = useState({});


  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      socket.emit("join_view_table_status");
      const listFoodCategory = await layDs();
      const listFood = await layDsSanPham();
      const tables = await getTables();
      const areas = await getAreas();
      if(listFoodCategory.dsLoaiSanPham && listFood.dsSanPham && tables.data && areas.data)
      {
        setFoodCategories(listFoodCategory.dsLoaiSanPham);
        setFoods(listFood.dsSanPham);
        setTables(tables.data);
        setAreas(areas.data);
        const areaTablesFilteredData = tables.data.filter(t => t.table_area_id === activeArea);
        setAreaTablesFiltered(areaTablesFilteredData);
      }
    })();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handler = async (table) => {
      reloadTables();
    }
    socket.on("update_table_status", handler);
  
    return () => {
        socket.off("update_table_status", handler);
    };
  
  }, [socket]);

  function toast(msg, type = "default") {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 3000);
  }

  /* ── TABLE ACTIONS ── */
  function handleTableClick(table) {
    setSelectedTable(table);
  }

  const handleUpdateTableStatus = async (table_id) => {
    const updateTableStatusData = await updateTableStatus({table_id: table_id, table_status: "EMPTY"});
    reloadTables();
  }

  const reloadTables = async () => {
    const tables = await getTables();
      const areas = await getAreas();
      if(tables.data && areas.data)
      {
        setTables(tables.data);
        setAreas(areas.data);
        const areaTablesFilteredData = tables.data.filter(t => t.table_area_id === activeArea);
        setAreaTablesFiltered(areaTablesFilteredData);
      }
  }


  function openOrderForTable() {
    setOrderTable(true);
    setSelectedTable(null);
    setCart([]);
    setActiveCat(1);
    setFoodSearch("");
  }

  function closeTable(table) {
    setTables(p => p.map(t => t.table_id === table.table_id ? { ...t, table_status: "EMPTY" } : t));
    setTableOpenTimes(p => { const n = { ...p }; delete n[table.table_id]; return n; });
    setSelectedTable(null);
    toast(`Đã đóng bàn ${table.table_name}`, "success");
  }

  /* ── FOOD / CART ── */
  function handleFoodClick(food) {
    if (food.food_status === "SOLD OUT") return;
    setNote("");
    setFoodTarget(food);
  }

  function addToCart() {
    const food = foodTarget;
    const key = food.food_id;
    let newNote = "";
    if(note != "")
    {
      newNote = note;
    }

    setCart(prev => {
      const existing = prev.find(i => i.key === key);
      // nếu món đã có trong giỏ
      if (existing) {
        // nếu có note mới -> cập nhật note
        if (newNote !== "") {
          return prev.map(i =>
            i.food_id === key
              ? { ...i, quantity: i.quantity + 1, note: newNote }
              : i
          );
        }

        // nếu không có note -> tăng số lượng
        return prev.map(i =>
          i.food_id === key
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, {
        key,
        food_id: food.food_id,
        food_name: food.food_name,
        price: food.price,
        quantity: 1,
        note: newNote,
      }];
    });
    setFoodTarget(null);
  }

  function changeQty(key, delta) {
    setCart(prev => {
      const updated = prev.map(i => i.key === key ? { ...i, quantity: i.quantity + delta } : i);
      return updated.filter(i => i.quantity > 0);
    });
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  /* ── PAYMENT ── */
  const handlePayConfirm = async () => {
    try 
    {
      const dataThanhToan = await thanhToan({tongTien: cartTotal, redirectUrlFe: "http://localhost:3000/momo/callback-takeaway"});
      if (!dataThanhToan || !dataThanhToan.shortLink) 
      {
        NotifyError("Không lấy được link thanh toán MoMo");
        return;
      }
      // Redirect sang MoMo
      localStorage.setItem("tongTien", cartTotal);
      localStorage.setItem("dsSanPham", JSON.stringify(cart));
      window.location.href = dataThanhToan.shortLink;
    } 
    catch(e) 
    {
      NotifyError("Lỗi kết nối thanh toán MoMo");
    }
    
  }

  /* ── FILTERED FOODS ── */
  const visibleFoods = foods.filter(f => {
    const matchCat = f.food_category_id === activeCat;
    const matchSearch = !foodSearch || f.food_name.toLowerCase().includes(foodSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!tables || !areas) {
      return <div className="loading">⏳ Đang tải danh sách bàn...</div>;
  }

  return (
    <>
      {/* ── TOPBAR ── */}
      <div className="tb">
        <div className="tb-logo">Smart<span>POS</span></div>
        <div style={{ fontSize: 13, color: "#fff9", fontWeight: 600 }}>Màn hình thu ngân</div>
        <div className="tb-spacer" />
        <button className="tb-order" onClick={() => {navigate("/nhanvien/xemdonhang")}}>🛒 Xem Orders</button>
        <button className="tb-order" onClick={() => {openOrderForTable()}}>🛒 Order mang về</button>
        <div className="tb-clock">
          {clock.toLocaleTimeString("vi-VN")} — {clock.toLocaleDateString("vi-VN")}
        </div>
        
      </div>

      {/* ── AREA TABS ── */}
      <div className="area-tabs">
        {areas.map(a => {
          const cnt = tables.filter(t => t.table_area_id === a.table_area_id);
          const occ = cnt.filter(t => t.table_status === "OCCUPIED").length;
          return (
            <div
              key={a.table_area_id}
              className={`area-tab${activeArea === a.table_area_id ? " active" : ""}`}
              onClick={() => setActiveArea(a.table_area_id)}
            >
              {a.table_area_name}
              <span style={{ marginLeft: 6, fontSize: 12, color: occ ? "#f97316" : "#cbd5e1" }}>
                {occ}/{cnt.length}
              </span>
            </div>
          );
        })}

        {/* Stats summary */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 20, padding: "0 8px" }}>
          <span style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>
            ● {tables.filter(t => t.table_status === "EMPTY").length} Trống
          </span>
          <span style={{ fontSize: 12, color: "#f97316", fontWeight: 700 }}>
            ● {tables.filter(t => t.table_status === "OCCUPIED").length} Có khách
          </span>
        </div>
      </div>

      {/* ── TABLE GRID ── */}
      <div className="table-grid-wrap">
        <div className="area-label">
          {areas.find(a => a.table_area_id === activeArea)?.table_area_name} —{" "}
          {areaTablesFiltered.length} bàn
        </div>
        <div className="table-grid">
          {areaTablesFiltered.map(table => {
            const isOcc = table.table_status === "OCCUPIED";
            return (
              <div
                key={table.table_id}
                className={`tcard ${isOcc ? "occupied" : "empty"}`}
                onClick={() => handleTableClick(table)}
              >
                <div className="tcard-icon">{isOcc ? "🍽️" : "🪑"}</div>
                <div className="tcard-name">{table.table_name}</div>
                <div className={`tcard-status ${isOcc ? "occupied" : "empty"}`}>
                  {isOcc ? "Có khách" : "Trống"}
                </div>
                {isOcc && tableOpenTimes[table.table_id] && (
                  <div className="tcard-time">Từ {tableOpenTimes[table.table_id]}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── TABLE ACTION MODAL ── */}
      {selectedTable && (
        <div className="overlay" onClick={() => setSelectedTable(null)}>
          <div className="tmodal" onClick={e => e.stopPropagation()}>
            <div className="tmodal-title">
              {selectedTable.table_status === "EMPTY" ? "🪑" : "🍽️"} Bàn {selectedTable.table_name}
            </div>
            <div className="tmodal-sub">
              {areas.find(a => a.table_area_id === selectedTable.table_area_id)?.table_area_name} —{" "}
              {selectedTable.table_status === "EMPTY" ? "Đang trống" : "Đang có khách"}
              {tableOpenTimes[selectedTable.table_id] && ` · Từ ${tableOpenTimes[selectedTable.table_id]}`}
            </div>

            {selectedTable.table_status === "OCCUPIED" ?
                <button 
                  className="tmodal-btn close-table" 
                  onClick={() => {
                    handleUpdateTableStatus(selectedTable.table_id)
                    closeTable(selectedTable)
                  }}
                >
                  ✅ Đóng bàn (Trả bàn)
                </button>
                : ""
            }
            <button className="tmodal-btn cancel" onClick={() => setSelectedTable(null)}>
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* ── ORDER SCREEN ── */}
      {orderTable && (
        <div className="overlay" style={{ alignItems: "stretch" }}>
          <div className="order-modal">
            {/* Order topbar */}
            <div className="order-topbar">
              <button className="order-close" onClick={() => setOrderTable(null)}>✕</button>
              <div style={{ width: 36 }} />
            </div>

            <div className="order-body">
              {/* Category sidebar */}
              <div className="cat-sidebar">
                {foodCategories && foodCategories.map(cat => (
                  <button
                    key={cat.food_category_id}
                    className={`cat-btn${activeCat === cat.food_category_id ? " active" : ""}`}
                    onClick={() => { setActiveCat(cat.food_category_id); setFoodSearch(""); }}
                  >
                    {cat.food_category_name}
                  </button>
                ))}
              </div>

              {/* Food grid */}
              <div className="food-grid-wrap">
                <div className="food-toolbar">
                  <input
                    className="food-search"
                    placeholder="🔍 Tìm món..."
                    value={foodSearch}
                    onChange={e => setFoodSearch(e.target.value)}
                  />
                </div>
                <div className="food-grid">
                  {visibleFoods.map(food => (
                    <div
                      key={food.food_id}
                      className={`food-card${food.food_status === "SOLD OUT" ? " soldout" : ""}`}
                      onClick={() => handleFoodClick(food)}
                    >
                      <div className="food-card-img">
                        <img
                          src={
                            food.image
                              ? `${api}/public/uploads/ProductImages/${food.image}`
                              : `${process.env.PUBLIC_URL}/favicon.png`
                          }
                          alt="sanpham"
                        />
                        {food.food_status === "SOLD OUT" && (
                          <div className="food-card-soldout-badge">Hết</div>
                        )}
                      </div>
                      <div className="food-card-body">
                        <div className="food-card-name">{food.food_name}</div>
                        <div className="food-card-price">{vnd(food.price)}</div>
                      </div>
                    </div>
                  ))}
                  {visibleFoods.length === 0 && (
                    <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "#cbd5e1", fontSize: 14 }}>
                      Không tìm thấy món nào
                    </div>
                  )}
                </div>
              </div>

              {/* Order panel */}
              <div className="order-panel">
                {cart.length === 0 ? (
                  <div className="order-empty">
                    <div className="order-empty-icon">🛒</div>
                    <div className="order-empty-text">Chưa có món nào</div>
                  </div>
                ) : (
                  <div className="order-items">
                    {cart.map(item => (
                      <div className="order-item-row" key={item.key}>
                        <div className="oi-qty-ctrl">
                          <button className="qty-btn" onClick={() => changeQty(item.key, 1)}>+</button>
                          <div className="qty-num">{item.quantity}</div>
                          <button className="qty-btn" onClick={() => changeQty(item.key, -1)}>−</button>
                        </div>
                        <div className="oi-info">
                          <div className="oi-name">{item.food_name}</div>
                          {item.note && <div className="oi-note">{item.note}</div>}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          <div className="oi-price">{vnd(item.price * item.quantity)}</div>
                          <button className="oi-remove" onClick={() => setCart(p => p.filter(i => i.key !== item.key))}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="order-panel-bottom">
                  <div className="summary-row">
                    <span>Tạm tính</span>
                    <span>{vnd(cartTotal)}</span>
                  </div>
                  <div className="summary-total">
                    <div className="summary-total-label">
                      Tổng cộng
                      <span>{cartCount} món</span>
                    </div>
                    <div className="summary-total-amount">{vnd(cartTotal)}</div>
                  </div>
                  <div className="order-actions">
                    <button className="btn-pay" disabled={cart.length === 0} onClick={() => setPayModal(true)}>T.TOÁN</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )} 

      {/* ── FOOD TARGET MODAL ── */}
      {foodTarget && (
        <div className="overlay" onClick={() => setFoodTarget(null)}>
          <div className="topping-modal" onClick={e => e.stopPropagation()}>
            <div className="topping-sub">{vnd(foodTarget.price)} · Tuỳ chọn thêm</div>

            <div className="topping-note-label">Ghi chú</div>
            <input
              className="topping-note-input"
              placeholder="Ví dụ: ít ngọt, không hành..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />

            <div className="topping-actions">
              <button className="btn-cancel" onClick={() => setFoodTarget(null)}>Huỷ</button>
              <button className="btn-add-to-cart" onClick={addToCart}>
                Thêm vào đơn · {vnd(foodTarget.price)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PAYMENT MODAL ── */}
      {payModal && (
        <div className="overlay" onClick={() => setPayModal(false)}>
          <div className="pay-modal" onClick={e => e.stopPropagation()}>
              <>
                <div className="pay-title">
                  Thanh toán
                </div>

                <div className="pay-sub">
                  Đơn hàng tại bàn {orderTable?.table_name}
                </div>

                <div className="pay-qr-wrap">
                  📱
                </div>

                <div className="pay-amount">
                  {vnd(cartTotal)}
                </div>
                
                <div className="pay-amount-label">
                  {cartCount} món —  Quét mã để thanh toán
                </div>

                <button className="pay-confirm" onClick={handlePayConfirm}>
                  ✅ Xác nhận quét mã
                </button>
                <button className="pay-cancel" onClick={() => setPayModal(false)}>Huỷ</button>
              </>
          </div>
        </div>
      )}

      {/* ── TOASTS ── */}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </>
  );
}

export default NV_XemTrangThaiBan;