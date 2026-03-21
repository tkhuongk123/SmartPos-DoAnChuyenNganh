import { useState, useEffect } from "react";
import "./ChiTietDonHang.css";
import { layChiTietTheoDon } from "../../../../services/ChiTietDonHangAPI";
import { laySanPhamTheoId } from "../../../../services/SanPhamAPI";
import ThongTinSanPham from "../../ThongTinSanPham";

function ChiTietDonHang(props) {
  const [dsSanPham, setDsSanPham] = useState([]);

  useEffect(() => {
    (async () => {
        const data = await layChiTietTheoDon({iddonhang: props.iddonhang})
        const newDs = []
        for(let x of data.dsChiTiet) {
            const dataSP = await laySanPhamTheoId({id: x.idsanpham})
            dataSP.sanPham.soluong = x.soluong
            newDs.push(dataSP.sanPham)
        }
        setDsSanPham(newDs)        
    })();
  }, [props]);

  return (
    <div className="ChiTietDonHang" onClick={(e) => {
      if(e.target.className === "ChiTietDonHang") {
        props.setChiTietDonHang('')
      }
    }}>
      <div className="ChiTietDonHang_content">
        <h3>Mã đơn hàng: {props.iddonhang}</h3>
        {
            dsSanPham.map((item, index) => {
                return (
                    <div className="ChiTietDonHang_item" key={index}>
                        <ThongTinSanPham item={item}/>
                    </div>
                )
            })
        }
      </div>
    </div>
  );
}

export default ChiTietDonHang;
