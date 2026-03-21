import formatPrice from "../../../../utils/formatPrice";
import "./ThanhToan.css";
import { layNgayGio } from "../../../../utils/ngayGio";
import { Select } from "antd";
import { NotifyError, NotifySuccess } from "../../../components/Toast";
import { thanhToan } from "../../../../services/PaymentAPI";

const { Option } = Select;

function ThanhToan(props) {


  // Hàm gọi backend tạo link MoMo và redirect
  const handleThanhToan = async () => {
    try 
    {
      const dataThanhToan = await thanhToan({tongTien: props.tongTien, redirectUrlFe: "http://localhost:3000/momo/callback"});
      if (!dataThanhToan || !dataThanhToan.shortLink) 
      {
        NotifyError("Không lấy được link thanh toán MoMo");
        return;
      }
      // Redirect sang MoMo
      sessionStorage.setItem("tongTien", props.tongTien);
      sessionStorage.setItem("tongSanPham", props.tongSanPham);
      sessionStorage.setItem("dsSanPham", JSON.stringify(props.dsSanPham));
      window.location.href = dataThanhToan.shortLink;
    } catch (error) {
      NotifyError("Lỗi kết nối thanh toán MoMo");
    }
  };

  

  return (
    <div
      className="ThanhToan"
      onClick={(e) => {
        if (e.target.className === "ThanhToan") {
          props.setThanhToan("");
        }
      }}
    >
      <div className="ThanhToan_content">
        <div className="ThanhToan_content-info">
          <div>
            <p>
              Đơn hàng: <span>{props.tongSanPham} sản phẩm</span>
            </p>
          </div>
          <div>
            <p>
              Tổng tiền: <span>{formatPrice(props.tongTien)} </span>
            </p>
            <p>Đã bao gồm phí VAT</p>
          </div>
        </div>
        <div className="ThanhToan_content-phuongthuc">
          <h3>Phương thức thanh toán</h3>
          <Select
            className="ThanhToan_content-phuongthuc-list"
            defaultValue="1"
          >
            <Option value="1">
              <div className="ThanhToan_content-phuongthuc-item">
                <p>Thanh toán qua VNPAY</p>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/vnpay.png`}
                  alt="vn-pay"
                  className="ThanhToan_content-phuongthuc-img"
                />
              </div>
            </Option>
            <Option value="2">
              <div className="ThanhToan_content-phuongthuc-item">
                <p>Thanh toán qua Momo</p>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/momo.png`}
                  alt="momo"
                  className="ThanhToan_content-phuongthuc-img"
                />
              </div>
            </Option>
            <Option value="3">
              <div className="ThanhToan_content-phuongthuc-item">
                <p>Thanh toán qua Ngân hàng</p>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/mb.png`}
                  alt="mb-bank"
                  className="ThanhToan_content-phuongthuc-img"
                />
              </div>
            </Option>
          </Select>
        </div>
        <div className="ThanhToan_content-control">
          <button
            className="ThanhToan_content-control-access"
            onClick={() => {
              handleThanhToan();
            }}
          >
            Thanh toán {formatPrice(props.tongTien)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThanhToan;
