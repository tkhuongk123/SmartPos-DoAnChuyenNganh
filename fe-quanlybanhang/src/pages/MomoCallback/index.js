import { useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { taoDonHang, updateOrderStatus } from "../../services/OrderAPI";
import { NotifyError, NotifySuccess } from "../../components/components/Toast";
import { taoChiTiet } from "../../services/OrderDetailAPI";
import { SocketContext } from "../../context/SocketProvider";
import { updateTableStatus } from "../../services/TableAPI";

function MomoCallback() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const hasRun = useRef(false);


  const handleThanhToan = async () => {
    const thanhtoan = 1;
    const tongTien = JSON.parse(sessionStorage.getItem("tongTien"));
    const currentTable = JSON.parse(sessionStorage.getItem("table"));
    const orderMethod = "DINE_IN";
    const ghichu = "";


    const order = await taoDonHang({
      table_id: currentTable.table_id,
      total_amount: tongTien,
      order_method: orderMethod,
      note: ghichu,
    });


    if (order.error) 
    {
        NotifyError("Lỗi tạo đơn hàng");
    } 
    else 
    {
        const dsSanPham = JSON.parse(sessionStorage.getItem("dsSanPham") || []);
        const order_id = order.data.order_id;
        for (let x of dsSanPham) 
        {
            const food_id = x.food_id;
            const quantity = x.quantity;
            const price = x.price;
            const note = x.note;
            await taoChiTiet({ order_id, food_id, quantity, price, note });
        }
        const updateTableStatusData = await updateTableStatus({table_id: currentTable.table_id, table_status: "OCCUPIED"});

        // emit socket 
        if(updateTableStatusData.isUpdated)
        {
          console.log(">>> Emited: ")
          socket.emit("update_table_status", currentTable);
        }
        socket.emit("new_order", order);

        let orders = JSON.parse(sessionStorage.getItem("orders") || "[]");
        if (orders.length > 0) 
        {
            orders.push(order.data);
        } 
        else 
        {
            orders = [order.data];
        }
        sessionStorage.setItem("orders", JSON.stringify(orders));
        
        sessionStorage.removeItem("giohang");
        sessionStorage.removeItem("tongTien");
        sessionStorage.removeItem("dsSanPham");

        NotifySuccess("Thanh toán thành công!");
    }
  };

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      handleThanhToan().then(() => {
        handleRedirect();
      });
    }
  }, []);


  const handleRedirect = () => {
    navigate("/auth/giohang");
  }

  return <button
        onClick={() => {
              handleRedirect();
            }}
        >
            Đang xử lý thanh toán...
        </button>;
}

export default MomoCallback;
