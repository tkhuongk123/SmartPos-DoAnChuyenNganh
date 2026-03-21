import { useEffect, useState } from "react";
import "./XuatHoaDon.css";
import { layDanhSach } from "../../../services/DonHangAPI";
import DanhSachDonHang from "../../components/DanhSachDonHang";
import ThongBaoTrong from "../../components/ThongBaoTrong";
import { layTaiKhoan } from "../../../services/TaiKhoanAPI";


function XuatHoaDon() {
  const [dsDonHang, setDsDonHang] = useState([]);

  useEffect(() => {
    (async () => {
        const data = await layDanhSach();
        if (data.dsDonHang) {
          const newDs = [];
          for (let x of data.dsDonHang) {
            if (x.trangthai === "11") {
              const data = await layTaiKhoan({ id: x.idmanguoidung });
              if (data.taiKhoan) {
                x.nguoidat = `${data.taiKhoan.tennguoidung} - ${data.taiKhoan.id}`;
                newDs.push(x);
              }
            } 
          }
          setDsDonHang(newDs);
        }
    })();
  });

  return (
    <div className="XuatHoaDon">
      <div className="XuatHoaDon_content">
        <h2>Đơn hàng đã thanh toán</h2>
        {dsDonHang.length === 0 ? (
          <ThongBaoTrong
            message="Chưa có đơn hàng nào"
          />
        ) : (
          <DanhSachDonHang dsDonHang={dsDonHang} option="13" />
        )}
      </div>
    </div>
  );
}

export default XuatHoaDon;
