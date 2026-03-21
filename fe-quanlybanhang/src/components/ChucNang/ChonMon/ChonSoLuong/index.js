import { useEffect, useState } from "react";
import "./ChonSoLuong.css";
import formatPrice from "../../../../utils/formatPrice";
import { NotifySuccess } from "../../../components/Toast";
import { Star, ThumbsUp } from "lucide-react";
import { tongDonHangTheoSanPham } from "../../../../services/FoodAPI";

function ChonSoLuong(props) {
  const [soLuong, setSoLuong] = useState(1);
  const [ghiChu, setGhiChu] = useState("");

  const nguoidung = JSON.parse(sessionStorage.getItem("nguoidung"));


  function themVaoGioHang() {
    const gioHang = JSON.parse(sessionStorage.getItem("giohang"));
    if (!gioHang || gioHang.lenght === 0) {
      const gioHang = [
        {
          food_id: props.sanPham.food_id,
          quantity: soLuong,
          note: ghiChu
        },
      ];
      sessionStorage.setItem("giohang", JSON.stringify(gioHang));
    } else {
      for (let x of gioHang) {
        if (x.food_id === props.sanPham.food_id) {
          if(ghiChu !== "")
          {
            x.note = ghiChu;
          }
          x.quantity += soLuong;
          sessionStorage.setItem("giohang", JSON.stringify(gioHang));
          NotifySuccess(`Đã thêm "${props.sanPham.food_name}" vào giỏ hàng`);
          return;
        }
      }
      gioHang.push({
        food_id: props.sanPham.food_id,
        quantity: soLuong,
        note: ghiChu
      });
      sessionStorage.setItem("giohang", JSON.stringify(gioHang));
      props.setDisplay("none");
    }
    NotifySuccess(`Đã thêm "${props.sanPham.food_name}" vào giỏ hàng`);
  }


  // Định dạng ngày
  const formatDate = (dateString) => {
    const datePart = dateString.split(" - ")[1];
    const date = new Date(datePart);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div
      className="ChonSoLuong"
      style={{ display: props.display }}
      onClick={(e) => {
        if (e.target.className === "ChonSoLuong") {
          props.setDisplay("none");
          setSoLuong(1);
        }
      }}
    >
      <div className="ChonSoLuong_content">
        <div className="ChonSoLuong_content-header">
          <button
            className="back-btn"
            onClick={(e) => {
              props.setDisplay("none");
              setSoLuong(1);
            }}
          >
            ← Quay lại
          </button>
        </div>
        <div className="ChonSoLuong_content-body">
          <div className="detail-img">
            <img
              className="detail-img-large"
              src={`${process.env.PUBLIC_URL}/assets/hinhSanPham/${props.sanPham.food_id}.jpg`}
              alt="sanpham"
            />
          </div>
          <div className="detail-info">
            <h1 className="name">
              <span>{props.sanPham.food_name}</span>
            </h1>

            <div className="detail-price">
              <span>{formatPrice(props.sanPham.price)}</span>
            </div>

            <p className="detail-description">{props.sanPham.description}</p>

            <div className="detail-quantity-selector">
              <label for="quantity">Số lượng:</label>
              <div className="quantity-controls">
                <button
                  className="decreaseBtn"
                  onClick={() => {
                    if (soLuong > 1) {
                      setSoLuong(soLuong - 1);
                    }
                  }}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={soLuong}
                  min="1"
                  max="50"
                  readonly
                />
                <button
                  className="increaseBtn"
                  onClick={() => {
                    if (soLuong < 20) {
                      setSoLuong(soLuong + 1);
                    }
                  }}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>

            <div className="detail-note">
              <label for="note">Ghi chú:</label>
              <div className="note-controls">
                <textarea
                  id="note"
                  value={ghiChu}
                  onChange={(e) => setGhiChu(e.target.value)}
                />
              </div>
            </div>


            <button
              className="detail-add"
              onClick={() => {
                themVaoGioHang();
              }}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              {formatPrice(props.sanPham.price * soLuong)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChonSoLuong;
