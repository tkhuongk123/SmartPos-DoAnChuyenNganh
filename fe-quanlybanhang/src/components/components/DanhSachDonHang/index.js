import "./DanhSachDonHang.css";
import { Table } from "antd";
import { formatTrangThai } from "../../../utils/formatTrangThai";
import formatPrice from "../../../utils/formatPrice";
import { capNhatDonHang } from "../../../services/DonHangAPI";
import {NotifyError, NotifySuccess, NotifyWarning} from "../Toast"
import { useState } from "react";
import ChiTietDonHang from "./ChiTietDonHang";
import DanhGiaDon from "./DanhGiaDon";
import { layChiTietTheoDon } from "../../../services/ChiTietDonHangAPI";
import { laySanPhamTheoId } from "../../../services/SanPhamAPI";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;




function DanhSachDonHang(props) {
  const [chiTietDonHang, setChiTietDonHang] = useState('')

  let dataSource;
  let columns;
  if (props.option === "30") {
    dataSource = props.dsDonHang.map((item, index) => {
      return {
        key: index,
        madon: item.id,
        ngay: item.ngay,
        trangthai: formatTrangThai(item.trangthai),
        tongsanpham: item.tongsanpham,
        tongtien: formatPrice(item.tongtien),
        diachi: item.diachi,
        chitiet: (
          <div className="chucNang3">
            <div className="chucNang3_content" onClick={() => {
              setChiTietDonHang(<ChiTietDonHang iddonhang={item.id} setChiTietDonHang={setChiTietDonHang}/>)
            }}>
              <i className="fa-solid fa-circle-info"></i>
            </div>
          </div>
        ),
        ghichu: item.ghichu,
      };
    });

    columns = [
      {
        title: "Mã đơn",
        dataIndex: "madon",
        key: "madon",
      },
      {
        title: "Ngày đặt",
        dataIndex: "ngay",
        key: "ngay",
      },
      {
        title: "Trang thái",
        dataIndex: "trangthai",
        key: "trangthai",
      },
      {
        title: "Tổng sản phẩm",
        dataIndex: "tongsanpham",
        key: "tongsanpham",
      },
      {
        title: "Tổng tiền",
        dataIndex: "tongtien",
        key: "tongtien",
      },
      {
        title: "Địa chỉ",
        dataIndex: "diachi",
        key: "diachi",
      },
      {
        title: "Chi tiết",
        dataIndex: "chitiet",
        key: "chitiet",
      },
      {
        title: "Ghi chú",
        dataIndex: "ghichu",
        key: "ghichu",
      },
    ];
  } else if (props.option === "10") {
    dataSource = props.dsDonHang.map((item, index) => {
      return {
        key: index,
        madon: item.id,
        nguoidat: item.nguoidat,
        ngay: item.ngay,
        tongsanpham: item.tongsanpham,
        tongtien: formatPrice(item.tongtien),
        chitiet: (
          <div className="chucNang3">
            <div className="chucNang3_content" onClick={() => {
              setChiTietDonHang(<ChiTietDonHang iddonhang={item.id} setChiTietDonHang={setChiTietDonHang}/>)
            }}>
              <i className="fa-solid fa-circle-info"></i>
            </div>
          </div>
        ),
        nhandon: (
          <div className="chucNang1">
            <div className="chucNang1_content" onClick={() => {
              capNhat(item.id, '10')
            }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
          </div>
        ),
        tuchoi: (
          <div className="chucNang2">
            <div className="chucNang2_content" onClick={() => {
              tuChoiDon(item.id, '12')
            }}>
              <i className="fa-solid fa-circle-xmark"></i>
            </div>
          </div>
        ),
      };
    });

    columns = [
      {
        title: "Mã đơn",
        dataIndex: "madon",
        key: "madon",
      },
      {
        title: "Người đặt",
        dataIndex: "nguoidat",
        key: "nguoidat",
      },
      {
        title: "Ngày đặt",
        dataIndex: "ngay",
        key: "ngay",
      },
      {
        title: "Tổng sản phẩm",
        dataIndex: "tongsanpham",
        key: "tongsanpham",
      },
      {
        title: "Tổng tiền",
        dataIndex: "tongtien",
        key: "tongtien",
      },
      {
        title: "Chi tiết",
        dataIndex: "chitiet",
        key: "chitiet",
      },
      {
        title: "Nhận đơn",
        dataIndex: "nhandon",
        key: "nhandon",
      },
      {
        title: "Từ chối",
        dataIndex: "tuchoi",
        key: "tuchoi",
      },
    ];
  } 
  else if (props.option === "13") {
    dataSource = props.dsDonHang.map((item, index) => {
      return {
        key: index,
        madon: item.id,
        nguoidat: item.nguoidat,
        ngay: item.ngay,
        tongsanpham: item.tongsanpham,
        tongtien: formatPrice(item.tongtien),
        chitiet: (
          <div className="chucNang3">
            <div className="chucNang3_content" onClick={() => {
              setChiTietDonHang(<ChiTietDonHang iddonhang={item.id} setChiTietDonHang={setChiTietDonHang}/>)
            }}>
              <i className="fa-solid fa-circle-info"></i>
            </div>
          </div>
        ),
        xuathoadon: (
          <div className="chucNang4">
            <div className="chucNang4_content" onClick={() => {
              xuathoadon(item)
            }}>
              <i className="fa-solid fa-file-pdf"></i>
            </div>
          </div>
        ),
      };
    });

    columns = [
      {
        title: "Mã đơn",
        dataIndex: "madon",
        key: "madon",
      },
      {
        title: "Người đặt",
        dataIndex: "nguoidat",
        key: "nguoidat",
      },
      {
        title: "Ngày đặt",
        dataIndex: "ngay",
        key: "ngay",
      },
      {
        title: "Tổng sản phẩm",
        dataIndex: "tongsanpham",
        key: "tongsanpham",
      },
      {
        title: "Tổng tiền",
        dataIndex: "tongtien",
        key: "tongtien",
      },
      {
        title: "Chi tiết",
        dataIndex: "chitiet",
        key: "chitiet",
      },
      {
        title: "Xuất hóa đơn",
        dataIndex: "xuathoadon",
        key: "xuathoadon",
      },
    ];
  }
  else if(props.option === "20") {
    dataSource = props.dsDonHang.map((item, index) => {
      return {
        key: index,
        madon: item.id,
        nguoidat: item.nguoidat,
        ngay: item.ngay,
        tongsanpham: item.tongsanpham,
        chitiet: (
          <div className="chucNang3">
            <div className="chucNang3_content" onClick={() => {
              setChiTietDonHang(<ChiTietDonHang iddonhang={item.id} setChiTietDonHang={setChiTietDonHang}/>)
            }}>
              <i className="fa-solid fa-circle-info"></i>
            </div>
          </div>
        ),
        nhandon: (
          <div className="chucNang1">
            <div className="chucNang1_content" onClick={() => {
              capNhat(item.id, '20')
            }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
          </div>
        ),
      };
    });

    columns = [
      {
        title: "Mã đơn",
        dataIndex: "madon",
        key: "madon",
      },
      {
        title: "Ngày đặt",
        dataIndex: "ngay",
        key: "ngay",
      },
      {
        title: "Tổng sản phẩm",
        dataIndex: "tongsanpham",
        key: "tongsanpham",
      },
      {
        title: "Chi tiết",
        dataIndex: "chitiet",
        key: "chitiet",
      },
      {
        title: "Nhận đơn",
        dataIndex: "nhandon",
        key: "nhandon",
      },
    ];
  }

  else if(props.option === "11") {
    dataSource = props.dsDonHang.map((item, index) => {
      return {
        key: index,
        madon: item.id,
        nguoidat: item.nguoidat,
        ngay: item.ngay,
        tongsanpham: item.tongsanpham,
        tongtien: formatPrice(item.tongtien),
        chitiet: (
          <div className="chucNang3">
            <div className="chucNang3_content" onClick={() => {
              setChiTietDonHang(<ChiTietDonHang iddonhang={item.id} setChiTietDonHang={setChiTietDonHang}/>)
            }}>
              <i className="fa-solid fa-circle-info"></i>
            </div>
          </div>
        ),
        tradon: (
          <div className="chucNang1">
            <div className="chucNang1_content" onClick={() => {
              capNhat(item.id, '11')
            }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
          </div>
        )
      };
    });

    columns = [
      {
        title: "Mã đơn",
        dataIndex: "madon",
        key: "madon",
      },
      {
        title: "Người đặt",
        dataIndex: "nguoidat",
        key: "nguoidat",
      },
      {
        title: "Ngày đặt",
        dataIndex: "ngay",
        key: "ngay",
      },
      {
        title: "Tổng sản phẩm",
        dataIndex: "tongsanpham",
        key: "tongsanpham",
      },
      {
        title: "Tổng tiền",
        dataIndex: "tongtien",
        key: "tongtien",
      },
      {
        title: "Chi tiết",
        dataIndex: "chitiet",
        key: "chitiet",
      },
      {
        title: "Trả đơn",
        dataIndex: "tradon",
        key: "tradon",
      },
    ];
  }

  else if(props.option === "21") {
    dataSource = props.dsDonHang.map((item, index) => {
      return {
        key: index,
        madon: item.id,
        nguoidat: item.nguoidat,
        ngay: item.ngay,
        tongsanpham: item.tongsanpham,
        chitiet: (
          <div className="chucNang3">
            <div className="chucNang3_content" onClick={() => {
              setChiTietDonHang(<ChiTietDonHang iddonhang={item.id} setChiTietDonHang={setChiTietDonHang}/>)
            }}>
              <i className="fa-solid fa-circle-info"></i>
            </div>
          </div>
        ),
        tradon: (
          <div className="chucNang1">
            <div className="chucNang1_content" onClick={() => {
              capNhat(item.id, '21')
            }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
          </div>
        ),
      };
    });

    columns = [
      {
        title: "Mã đơn",
        dataIndex: "madon",
        key: "madon",
      },
      {
        title: "Ngày đặt",
        dataIndex: "ngay",
        key: "ngay",
      },
      {
        title: "Tổng sản phẩm",
        dataIndex: "tongsanpham",
        key: "tongsanpham",
      },
      {
        title: "Chi tiết",
        dataIndex: "chitiet",
        key: "chitiet",
      },
      {
        title: "Trả đơn",
        dataIndex: "tradon",
        key: "tradon",
      },
    ];
  }
  else if(props.option === "31") {
    dataSource = props.dsDonHang.map((item, index) => {
      return {
        key: index,
        madon: item.id,
        ngay: item.ngay,
        trangthai: formatTrangThai(item.trangthai),
        tongsanpham: item.tongsanpham,
        tongtien: formatPrice(item.tongtien),
        chitiet: (
          <div className="chucNang3">
            <div className="chucNang3_content" onClick={() => {
              setChiTietDonHang(<ChiTietDonHang iddonhang={item.id} setChiTietDonHang={setChiTietDonHang}/>)
            }}>
              <i className="fa-solid fa-circle-info"></i>
            </div>
          </div>
        ),
        danhgia: (
          <div className="chucNang3">
            <div className="chucNang3_content" onClick={() => {
              setChiTietDonHang(<DanhGiaDon iddonhang={item.id} setChiTietDonHang={setChiTietDonHang} idmanguoidung={props.nguoidung.id}/>)
            }}>
              <i className="fa-solid fa-envelope"></i>
            </div>
          </div>
        ),
        ghichu: item.ghichu,
      };
    });

    columns = [
      {
        title: "Mã đơn",
        dataIndex: "madon",
        key: "madon",
      },
      {
        title: "Ngày đặt",
        dataIndex: "ngay",
        key: "ngay",
      },
      {
        title: "Trang thái",
        dataIndex: "trangthai",
        key: "trangthai",
      },
      {
        title: "Tổng sản phẩm",
        dataIndex: "tongsanpham",
        key: "tongsanpham",
      },
      {
        title: "Tổng tiền",
        dataIndex: "tongtien",
        key: "tongtien",
      },
      {
        title: "Chi tiết",
        dataIndex: "chitiet",
        key: "chitiet",
      },
      {
        title: "Đánh giá",
        dataIndex: "danhgia",
        key: "danhgia",
      },
      {
        title: "Ghi chú",
        dataIndex: "ghichu",
        key: "ghichu",
      },
    ];
  }
  else if(props.option === "00") {
    dataSource = props.dsDonHang.map((item, index) => {
      return {
        key: index,
        madon: item.id,
        nguoidat: item.nguoidat,
        ngay: item.ngay,
        trangthai: formatTrangThai(item.trangthai),
        tongsanpham: item.tongsanpham,
        tongtien: formatPrice(item.tongtien),
        diachi: item.diachi,
        chitiet: (
          <div className="chucNang3">
            <div className="chucNang3_content" onClick={() => {
              setChiTietDonHang(<ChiTietDonHang iddonhang={item.id} setChiTietDonHang={setChiTietDonHang}/>)
            }}>
              <i className="fa-solid fa-circle-info"></i>
            </div>
          </div>
        ),
        ghichu: item.ghichu,
      };
    });

    columns = [
      {
        title: "Mã đơn",
        dataIndex: "madon",
        key: "madon",
      },
      {
        title: "Người đặt",
        dataIndex: "nguoidat",
        key: "nguoidat",
      },
      {
        title: "Ngày đặt",
        dataIndex: "ngay",
        key: "ngay",
      },
      {
        title: "Trang thái",
        dataIndex: "trangthai",
        key: "trangthai",
      },
      {
        title: "Tổng sản phẩm",
        dataIndex: "tongsanpham",
        key: "tongsanpham",
      },
      {
        title: "Tổng tiền",
        dataIndex: "tongtien",
        key: "tongtien",
      },
      {
        title: "Địa chỉ",
        dataIndex: "diachi",
        key: "diachi",
      },
      {
        title: "Chi tiết",
        dataIndex: "chitiet",
        key: "chitiet",
      },
      {
        title: "Ghi chú",
        dataIndex: "ghichu",
        key: "ghichu",
      },
    ];
  }
  else if(props.option === "01") {
    dataSource = props.dsDonHang.map((item, index) => {
      return {
        key: index,
        madon: item.id,
        nguoidat: item.nguoidat,
        ngay: item.ngay,
        trangthai: formatTrangThai(item.trangthai),
        tongsanpham: item.tongsanpham,
        tongtien: formatPrice(item.tongtien),
        chitiet: (
          <div className="chucNang3">
            <div className="chucNang3_content" onClick={() => {
              setChiTietDonHang(<ChiTietDonHang iddonhang={item.id} setChiTietDonHang={setChiTietDonHang}/>)
            }}>
              <i className="fa-solid fa-circle-info"></i>
            </div>
          </div>
        ),
        danhgia: (
          <div className="chucNang3">
            <div className="chucNang3_content" onClick={() => {
              setChiTietDonHang(<DanhGiaDon iddonhang={item.id} setChiTietDonHang={setChiTietDonHang} />)
            }}>
              <i className="fa-solid fa-envelope"></i>
            </div>
          </div>
        ),
        ghichu: item.ghichu,
      };
    });

    columns = [
      {
        title: "Mã đơn",
        dataIndex: "madon",
        key: "madon",
      },
      {
        title: "Người đặt",
        dataIndex: "nguoidat",
        key: "nguoidat",
      },
      {
        title: "Ngày đặt",
        dataIndex: "ngay",
        key: "ngay",
      },
      {
        title: "Trang thái",
        dataIndex: "trangthai",
        key: "trangthai",
      },
      {
        title: "Tổng sản phẩm",
        dataIndex: "tongsanpham",
        key: "tongsanpham",
      },
      {
        title: "Tổng tiền",
        dataIndex: "tongtien",
        key: "tongtien",
      },
      {
        title: "Chi tiết",
        dataIndex: "chitiet",
        key: "chitiet",
      },
      {
        title: "Đánh giá",
        dataIndex: "danhgia",
        key: "danhgia",
      },
      {
        title: "Ghi chú",
        dataIndex: "ghichu",
        key: "ghichu",
      },
    ];
  }

  const capNhat = async(id, trangthai) => {
    const data = await capNhatDonHang({id, trangthai, ghichu: ''})
    if(data.error) {
      NotifyError(data.error)
    } else {
      NotifySuccess('Cập nhật trạng thái thành công')
      const newDs = props.dsDonHang.filter(item => id !== item.id);
      props.setDsDonHang(newDs)
    }
  }

  const tuChoiDon = async(id, trangthai) => {
    const data = await capNhatDonHang({id, trangthai, ghichu: 'Xin lỗi quý khách vì sự cố'})
    if(data.error) {
      NotifyError(data.error)
    } else {
      NotifyWarning('Từ chối đơn thành công')
      const newDs = props.dsDonHang.filter(item => id !== item.id);
      props.setDsDonHang(newDs)
    }
  }


  const xuathoadon = async (item) => {
    const data = await layChiTietTheoDon({ iddonhang: item.id });
    const newDs = [];

    for (let x of data.dsChiTiet) {
      const dataSP = await laySanPhamTheoId({ id: x.idsanpham });
      dataSP.sanPham.soluong = x.soluong;
      newDs.push(dataSP.sanPham);
    }

    if (!data.dsChiTiet || newDs.length === 0) {
      NotifyError("Lỗi xuất hóa đơn");
      return;
    }

    // Chuẩn bị bảng chi tiết sản phẩm
    const ctsp = newDs.map((sp) => {
      const thanhTien = sp.dongia * sp.soluong;
      return [
          { text: sp.ten, alignment: "left" },
          { text: sp.soluong.toString(), alignment: "center" },
          { text: sp.dongia.toLocaleString(), alignment: "right" },
          { text: thanhTien.toLocaleString(), alignment: "right" }
        ];
      });

      // Định nghĩa tài liệu PDF
      const docDefinition = {
        content: [
          { text: "HÓA ĐƠN BÁN HÀNG", style: "header", alignment: "center" },
          { text: `Mã hóa đơn: ${item.id}`, margin: [0, 20, 0, 0] },
          { text: `Người đặt: ${item.nguoidat}` },
          { text: `Địa chỉ: ${item.diachi}` },
          { text: `Ngày đặt: ${item.ngay}` },
          { text: `Ghi chú: ${item.ghichu || "Không có"}` },

          {
            style: "tableExample",
            table: {
              headerRows: 1,
              widths: ["*", "auto", "auto", "auto"],
              body: [
                [
                  { text: "Sản phẩm", bold: true },
                  { text: "Số lượng", bold: true },
                  { text: "Đơn giá", bold: true },
                  { text: "Thành tiền", bold: true }
                ],
                ...ctsp
              ]
            },
            margin: [0, 20, 0, 0]
          },

          { text: `Tổng sản phẩm: ${item.tongsanpham}`, margin: [0, 20, 0, 0] },
          { text: `Tiền ship: ${item.tienShip.toLocaleString()} VND` },
          { text: `Tổng tiền: ${item.tongtien.toLocaleString()} VND` }
        ],
        styles: {
          header: { fontSize: 16, bold: true },
          tableExample: { margin: [0, 5, 0, 15] }
        },
        defaultStyle: {
          font: "Roboto"
        }
    };

    // Xuất PDF
    pdfMake.createPdf(docDefinition).download(`HoaDon_${item.id}.pdf`);
  };


  return (
    <div className="DanhSachDonhang">
      <div className="DanhSachDonHang_content">
        <Table
          dataSource={dataSource}
          columns={columns}
          className="DanhSachDonHang_content-table"
          pagination={{pageSize: 5}}
        />
      </div>
      {
        chiTietDonHang
      }
    </div>
  );
}

export default DanhSachDonHang;
