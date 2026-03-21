// FRAMEWORKS
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../../../context/SocketProvider.js";

// COMPONENTS
import "./ChonMon.css";
import ChonSoLuong from "./ChonSoLuong/index.js";
import formatPrice from "../../../utils/formatPrice.js";
import { NotifyError, NotifySuccess } from "../../components/Toast/index.js";
import { Pagination } from "antd";

// APIS
import { api } from "../../../services/config.js";
import { layDs } from "../../../services/FoodCategoryAPI.js";
import {
  layDsSanPham,
} from "../../../services/FoodAPI.js";

import { getTableById } from "../../../services/TableAPI.js";


function ChonMon() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const didRun = useRef(false);
  const pageSize = 8;

  // useState
  const [dsLoai, setDsLoai] = useState([]);
  const [dsSanPham, setDsSanPham] = useState([]);
  const [loaiDangChon, setLoaiDangChon] = useState(0);
  const [tuKhoa, setTuKhoa] = useState("");
  const [chiTiet, setChiTiet] = useState("none");
  const [sanPham, setSanPham] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [table, setTable] = useState(null);
  const [menuLoadedKey, setMenuLoadedKey] = useState("");
  
  // useEffect chỉ chạy 1 lần duy nhất khi truy cập vào url: http://localhost:3000/menu/:tableId
  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    let isCancelled = false;
    (async () => {
      const key = `menu_loaded_${tableId}`;
      const hasLoaded = sessionStorage.getItem(key);

      if (!hasLoaded) 
      {
        const tableRes = await getTableById(tableId); 
        if (isCancelled) return;
        if(tableRes.data && tableRes.data.table_status == "EMPTY")
        {
          // socket.emit("open-table", tableRes.data);
          sessionStorage.setItem("table", JSON.stringify(tableRes.data));
          setTable(tableRes.data);
          NotifySuccess(`Đã chọn bàn ${tableRes.data.table_id}`);
        }
        else 
        {
          // navigate("/notify")
        }
        sessionStorage.setItem(key, "true");
      }
    })();
  }, []);


  useEffect(() => {
    (async () => {
      const dataDsLoaiSanPham = await layDs();
      const dataDsSanPham = await layDsSanPham();
      if(dataDsSanPham)
      {
        setDsLoai(dataDsLoaiSanPham.dsLoaiSanPham);
        setDsSanPham(dataDsSanPham.dsSanPham);
      }
    })();
  }, [tableId]);

  const xuLyThayDoiLoai = (loai) => {
    setLoaiDangChon(loai);
    setCurrentPage(1);
    setTuKhoa("");
  };

  const xuLyTimKiem = (e) => {
    setTuKhoa(e.target.value);
  };

  const xuLyXoaTimKiem = () => {
    setTuKhoa("");
  };

  const sanPhamDaLoc = dsSanPham.filter((sanPham) => {
                          const khopLoai =
                            loaiDangChon === 0 || sanPham.food_category_id === loaiDangChon;
                          const khopTuKhoa = sanPham.food_name
                            .toLowerCase()
                            .includes(tuKhoa.toLowerCase());
                          return khopLoai && khopTuKhoa;
                        });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const sanPhamHienThi = sanPhamDaLoc.slice(startIndex, endIndex);

  function themVaoGio(sanPham) {
    const gioHang = JSON.parse(sessionStorage.getItem("giohang"));
    if (!gioHang || gioHang.lenght === 0) {
      const gioHang = [
        {
          food_id: sanPham.food_id,
          quantity: 1,
          note: ""
        },
      ];
      sessionStorage.setItem("giohang", JSON.stringify(gioHang));
    } else {
      for (let x of gioHang) {
        if (x.food_id === sanPham.food_id) {
          x.quantity += 1;
          sessionStorage.setItem("giohang", JSON.stringify(gioHang));
          NotifySuccess(`Đã thêm "${sanPham.food_name}" vào giỏ hàng`);
          return;
        }
      }
      gioHang.push({
        food_id: sanPham.food_id,
        quantity: 1
      });
      sessionStorage.setItem("giohang", JSON.stringify(gioHang));
    }
    NotifySuccess(`Đã thêm "${sanPham.food_name}" vào giỏ hàng`);
  }

  return (
    <div className="ChonMon">
      <div className="ChonMon_header">
        PURETASTE KITCHEN KÍNH CHÀO QUÝ KHÁCH
      </div>
      <div className="ChonMon_content">
        <div className="ChonMon_filter">
          <div className="filter-loai">
            <button
              className={`filter-btn ${loaiDangChon === 0 ? "active" : ""}`}
              onClick={() => xuLyThayDoiLoai(0)}
            >
              Tất cả
            </button>
            {dsLoai.map((loai) => (
              <button
                key={loai.food_category_id}
                className={`filter-btn ${
                  loaiDangChon === loai.food_category_id ? "active" : ""
                }`}
                onClick={() => xuLyThayDoiLoai(loai.food_category_id)}
              >
                {loai.food_category_name}
              </button>
            ))}
          </div>

          <div className="search-container">
            <input
              type="text"
              className="search-mon-an"
              placeholder="Tìm kiếm món ăn..."
              value={tuKhoa}
              onChange={xuLyTimKiem}
            />
            {tuKhoa && (
              <button className="search-clear" onClick={xuLyXoaTimKiem}>
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="ChonMon_list">
          {sanPhamHienThi.map((item, index) => {
            return (
              <div
                className="MonAn"
                key={index}
                onClick={(e) => {
                  if (e.target.className !== "MonAn-add") {
                    setSanPham(item);
                    setChiTiet("flex");
                  }
                }}
              >
                <div className="MonAn-img">
                  <img
                    src={
                      item.image
                        ? `${api}/public/uploads/ProductImages/${item.image}`
                        : `${process.env.PUBLIC_URL}/favicon.png`
                    }
                    alt="sanpham"
                  />
                </div>
                <h3 className="MonAn-title">{item.food_name}</h3>
                <div className="MonAn-price">
                  <span>{formatPrice(item.price)}</span>
                </div>

                <button
                  className="MonAn-add"
                  onClick={() => {
                    themVaoGio(item);
                  }}
                >
                  Thêm
                </button>
              </div>
            );
          })}
        </div>
        <div className="ChonMon_pagination">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={sanPhamDaLoc.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: 20, textAlign: "center" }}
          />
        </div>
      </div>

      <ChonSoLuong
        sanPham={sanPham}
        display={chiTiet}
        setDisplay={setChiTiet}
      />
    </div>
  );
}

export default ChonMon;
