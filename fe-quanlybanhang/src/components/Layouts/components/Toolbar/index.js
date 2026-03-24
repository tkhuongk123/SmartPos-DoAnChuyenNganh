import { useEffect, useState } from "react";
import "./Toolbar.css";
import { useNavigate } from "react-router-dom";

function Toolbar() {
  const [dsChucNang, setDsChucNang] = useState("");
  const [tenNguoiDung, setTenNguoiDung] = useState(""); 
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user")) || '';
    const tableRes = JSON.parse(sessionStorage.getItem(`table`)) || '';
    if(user.name)
    {
      setTenNguoiDung(user.name);
    }
    if (!user) {
      setDsChucNang(
        <>
          <li
            onClick={() => {
              navigate(`/menu/${tableRes.table_id}`);
            }}
          >
            Trang chủ
          </li>
          <li
            onClick={() => {
              navigate("/auth/giohang");
            }}
          >
            Giỏ hàng
          </li>
          <li
            onClick={() => {
              navigate("/xemDonHang");
            }}
          >
            Đơn hàng
          </li>
        </>
      );
    }
    
    if (user.role == "MANAGER") {
      setDsChucNang(
        <>
          <li
            onClick={() => {
              navigate("/quanly/dashboard");
            }}
          >
            Thống kê
          </li>
          <li
            onClick={() => {
              navigate("/quanly/food");
            }}
          >
            Quản lý món ăn
          </li>
          <li
            onClick={() => {
              navigate("/quanly/food-category");
            }}
          >
            Quản lý loại món ăn
          </li>
          <li
            onClick={() => {
              navigate("/quanly/import");
            }}
          >
            Quản lý nhập hàng
          </li>
          <li
            onClick={() => {
              navigate("/quanly/supplier");
            }}
          >
            Quản lý nhà cung cấp
          </li>
          <li
            onClick={() => {
              navigate("/quanly/order");
            }}
          >
            Xem lịch sử đon hàng
          </li>
          <li
            onClick={() => {
              navigate("/quanly/staff");
            }}
          >
            Quản lý nhân viên 
          </li>
          <li
            onClick={() => {
              navigate("/quanly/table");
            }}
          >
            Quản lý bàn
          </li>
          <li
            onClick={() => {
              navigate("/quanly/table-area");
            }}
          >
            Quản lý khu vực bàn
          </li>
        </>
      );
    } 
  }, [navigate]);

  return (
    <nav className="Toolbar">
      <div className="Toolbar_content">
        <div className="Toolbar_content-img">
          <img src={`${process.env.PUBLIC_URL}/favicon.png`} alt="Logo" />
        </div>
      <h4>{tenNguoiDung != "" ? `Quản lý - ${tenNguoiDung}` : ""}</h4>
        <div className="Toolbar_content-subnav">
          <ul>
            {dsChucNang}
            <li
              onClick={(event) => {
                navigate('/')
                setTimeout(() => {
                  sessionStorage.removeItem("user");
                  window.location.reload();
                }, 100)
              }}
            >
              Đăng xuất
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Toolbar;
