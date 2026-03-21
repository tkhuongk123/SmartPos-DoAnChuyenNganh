import { useState, useEffect } from "react";
import "./XemGioHang.css";
import ThanhPhanGioHang from "../../components/ThongTinSanPham";
import formatPrice from "../../../utils/formatPrice";
import ThanhToan from "./ThanhToan";
import { Input, Form } from "antd";
import { MapPin } from "lucide-react";

import { laySanPhamTheoId } from "../../../services/FoodAPI";
import { NotifyError } from "../../components/Toast";
import ThongBaoTrong from "../../components/ThongBaoTrong";

function XemGioHang() {
  const [form] = Form.useForm();
  const [dsSanPham, setDsSanPham] = useState([]);
  const [thanhToan, setThanhToan] = useState(<span></span>);


  useEffect(() => {
    const giohang = JSON.parse(sessionStorage.getItem("giohang"));
    
    if (giohang) 
    {
      (async () => {
        const newDs = [];
        for (let x of giohang) 
        {
          const food = await laySanPhamTheoId({ food_id: x.food_id });
          if (food.data) 
          {
            console.log("food.data: ", food.data);
            food.data.quantity = x.quantity;
            food.data.note = x.note;
            newDs.push(food.data);
          } 
          else 
          {
            NotifyError(food.message);
          }
        }
        console.log("dsSanPham: ", newDs);
        setDsSanPham(newDs);
      })();
    }
  }, []);


  function tinhTongTien() {
    let tong = 0;
    for (let x of dsSanPham) {
      tong += x.quantity * x.price;
    }
    return tong;
  }

  function tinhTongSanPham()
  {
    let tongSanPham = 0;
    for (let x of dsSanPham)
    {
      tongSanPham += x.quantity;
    }
    return tongSanPham;
  }


  function tang(sanPham) {
    sanPham.quantity++;
    const newDs = [...dsSanPham];
    for (let x of newDs) {
      if (x.food_id === sanPham.food_id) {
        x.quantity = sanPham.quantity;
      }
    }
    setDsSanPham(newDs);
    sessionStorage.setItem("giohang", JSON.stringify(newDs));
  }

  function giam(sanPham) {
    if (sanPham.quantity > 1) 
    {
      sanPham.quantity--;
      const newDs = [...dsSanPham];
      for (let x of newDs) {
        if (x.food_id === sanPham.food_id) {
          x.quantity = sanPham.quantity;
        }
      }
      setDsSanPham(newDs);
      sessionStorage.setItem("giohang", JSON.stringify(newDs));
    }
  }

  function xoaSanPham(index) {
    const newDs = [...dsSanPham];
    newDs.splice(index, 1);
    setDsSanPham(newDs);
    sessionStorage.setItem("giohang", JSON.stringify(newDs));
  }

  const handleThanhToan = () => {
    setThanhToan(
      <ThanhToan
        setThanhToan={setThanhToan}
        tongSanPham={tinhTongSanPham()}
        tongTien={tinhTongTien()}
        dsSanPham={dsSanPham}
        setDsSanPham={setDsSanPham}
      />
    );
  };

  return (
    <div className="XemGioHang">
      <div className="XemGioHang_content">
        <h2>Giỏ hàng của tôi</h2>
        <div className="XemGioHang_list">
          {dsSanPham.map((item, index) => {
            return (
              <div className="XemGioHang_item" key={index}>
                <div className="XemGioHang_item-sanpham">
                  <ThanhPhanGioHang item={item} note={item.note} />
                </div>
                <div className="XemGioHang_item-control">
                  <button
                    onClick={() => {
                      giam(item);
                    }}
                  >
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => {
                      tang(item);
                    }}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
                <div className="XemGioHang_item-delete">
                  <i
                    className="fa-solid fa-trash"
                    onClick={() => {
                      xoaSanPham(index);
                    }}
                  ></i>
                </div>
              </div>
            );
          })}
        </div>
        {dsSanPham.length === 0 ? (
          <ThongBaoTrong title="Trang chủ" message="Chưa có sản phẩm nào được thêm vào giỏ hàng" link="/"/>
        ) : (
          <div className="XemGioHang_don">
            <div>
              <span>Tổng sản phẩm: </span>
              <span className="XemGioHang_don-primary">{tinhTongSanPham()}</span>
            </div>
            <div>
              <span>Tổng tiền: </span>
              <span className="XemGioHang_don-primary">
                {formatPrice(tinhTongTien())}
              </span>
            </div>
            <div>
              <button
                onClick={handleThanhToan}
              >
                Thanh toán
              </button>
            </div>
          </div>

        )}
      </div>
      {thanhToan}
    </div>
  );
}

export default XemGioHang;
