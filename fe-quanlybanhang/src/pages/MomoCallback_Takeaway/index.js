import { useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { taoDonHang } from "../../services/OrderAPI";
import { NotifyError, NotifySuccess } from "../../components/components/Toast";
import { taoChiTiet } from "../../services/OrderDetailAPI";
import { SocketContext } from "../../context/SocketProvider";

function MomoCallback_Takeaway() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const hasRun = useRef(false);


  const handleThanhToan = async () => {
    const thanhtoan = 1;
    const tongTien = JSON.parse(localStorage.getItem("tongTien"));
    const orderMethod = "TAKEAWAY";
    const ghichu = "MANG VỀ";


    const order = await taoDonHang({
      table_id: null,
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
        const dsSanPham = JSON.parse(localStorage.getItem("dsSanPham") || []);
        const order_id = order.data.order_id;
        for (let x of dsSanPham) 
        {
            const food_id = x.food_id;
            const quantity = x.quantity;
            const price = x.price;
            const note = x.note;
            await taoChiTiet({ order_id, food_id, quantity, price, note });
        }
        socket.emit("new_order", order);
        localStorage.removeItem("tongTien");
        localStorage.removeItem("dsSanPham");
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
    navigate("/nhanvien/xemtrangthaiban");
  }

  return <button
        onClick={() => {
              handleRedirect();
            }}
        >
            Đang xử lý thanh toán...
        </button>;
}

export default MomoCallback_Takeaway;
