// FRAMEWORKS
import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

// COMPONENTS
import "./NV_XemDonHang.css";
import OrderCard from "../../components/ChucNang/OrderCard";


// APIS
import { layChiTietTheoDon } from "../../services/OrderDetailAPI";
import { laySanPhamTheoId } from "../../services/FoodAPI";
import { getTableById } from "../../services/TableAPI";
import { layDanhSachTheoOrderMethod } from "../../services/OrderAPI";


function NV_XemDonHang() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [orders, setOrders] = useState([]);

    // useEffects
    useEffect(() => {
        (async () => {
          const orders = await layDanhSachTheoOrderMethod("TAKEAWAY");
          if(orders.length > 0)
          {
              const ordersContainOrderDetails = await Promise.all(
                orders.map(async (order) => {
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
      

    // Functions
    const filtered = orders.filter(o => {
        const matchSearch = search === "" ||
        String(o.order_id).toLowerCase().includes(search.toLowerCase()) ||
        o.table_name.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });
    
    const counts = {};
    orders.forEach(o => { counts[o.order_status] = (counts[o.order_status] || 0) + 1; });

    return (
        <div className="NV-order-list-wrapper">
            {/* Header */}
            <div className="header">
                <div style={{ flex: 1 }}>
                <div className="header-title">📋 Danh sách đơn hàng</div>
                <div className="header-subtitle">Smart POS · Hôm nay, {new Date().toLocaleDateString("vi-VN")}</div>
                </div>
                <div className="header-count">{orders.length} đơn</div>
            </div>
        
            {/* Search */}
            <div className="search-row">
                <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                    className="search-input"
                    placeholder="Tìm mã đơn, tên bàn..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                {search && (
                    <button className="search-clear" onClick={() => setSearch("")}>✕</button>
                )}
                </div>
            </div>
        
        
            {/* Order List */}
            <div className="order-list">
                {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🍽️</div>
                    <div className="empty-text">Không tìm thấy đơn hàng</div>
                </div>
                ) : (
                filtered.map(order => (
                    <OrderCard 
                        key={order.order_id} 
                        order={order} 
                        onClick={() => navigate(`/xemDonHang/${order.order_id}`)} 
                    />
                ))
                )}
            </div>
        </div>
    )
}

export default NV_XemDonHang;
