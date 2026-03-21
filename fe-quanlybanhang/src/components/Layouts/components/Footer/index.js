import "./Footer.css";

function Footer() {
  return (
    <footer className="Footer">
      <div className="Footer_content">
        <div className="Footer_content-left">
          <h2>PURETASTE KITCHEN</h2>
          <p>
            Nơi trải nghiệm sự thăng hoa của ẩm thực, mang hương vị nhà hàng đến
            với gia đình bạn.
          </p>
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/bo-cong-thuong.png`}
            alt="thong-bao-bo-cong-thuong"
          />
        </div>
        <div className="Footer_content-center">
          <h3>LIÊN HỆ</h3>
          <h4>CÔNG TY CỔ PHẦN ĐẦU TƯ VÀ DỊCH VỤ NHÓM 2</h4>
          <p>
            <strong>Mã số thuế</strong>: 316657994
          </p>
          <p>
            <strong>Địa chỉ ĐKKD</strong>: 273 An Dương Vương, Phường 3, Quận 5, Tp. Hồ Chí Minh
          </p>
          <p>
            <strong>Phone</strong>: 1900 633 818
          </p>
          <p>
            <strong>Email</strong>: order.ptkitchen@gmail.com
          </p>
        </div>
        <div className="Footer_content-right">
          <h3>Hỗ trợ Khách hàng</h3>
          <ul>
            <li>- Chính sách bảo mật thông tin</li> 
            <li>- Quy chế hoạt động</li>
            <li>- Chính sách thanh toán</li>
            <li>- Chính sách thay đổi đơn hàng</li>
            <li>- Chính sách vận chuyển</li>
            <li>- Tự công bố sản phẩm</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
