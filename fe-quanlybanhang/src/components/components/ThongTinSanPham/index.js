import "./ThongTinSanPham.css";
import formatPrice from "../../../utils/formatPrice";
import { api } from "../../../services/config";

function ThongTinSanPham(props) {

  return (
    <div className="ThongTinSanPham">
      {props.item ? (
        <div className="ThongTinSanPham_content">
          <div className="ThongTinSanPham_content-img">
            <img
              src={
                props.item.image ? 
                `${api}/public/uploads/ProductImages/${props.item.image}`
                : `${process.env.PUBLIC_URL}/favicon.png`
              }
              alt="props.item"
            />
          </div>
          <div className="ThongTinSanPham_content-info">
            <p>{props.item.food_name}</p>
            <p>{formatPrice(props.item.price)}</p>
          </div>
          <div className="ThongTinSanPham_content-mota">
            <h3>Ghi chú:</h3>
            <p>{props.item.note}</p>
          </div>
          <div className="ThongTinSanPham_content-tong">
            <p>{formatPrice(props.item.quantity * props.item.price)}</p>
          </div>
          <div className="ThongTinSanPham_content-soluong">
            Số lượng: 
          </div>
          
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ThongTinSanPham;
