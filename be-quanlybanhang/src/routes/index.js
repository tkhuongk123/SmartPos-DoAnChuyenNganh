const TaiKhoanRoute = require("./TaiKhoanRoute");
const SanPhamRoute = require("./SanPhamRoute");
const LoaiSanPhamRoute = require("./LoaiSanPhamRoute");
const TableRoute = require("./TableRoute");
const PaymentRoute = require("./PaymentRoute");
const DonHangRoute = require("./DonHangRoute");
const ChiTietDonHangRoute = require("./ChiTietDonHangRoute");
const IngredientRoute = require("./IngredientRoute");
const SupplierRoute = require("./SupplierRoute");
const UserRoute = require("./UserRoute");


function routes(app) {
    app.use("/taikhoan", TaiKhoanRoute);
    app.use("/sanpham", SanPhamRoute);
    app.use("/loaisanpham", LoaiSanPhamRoute);
    app.use("/table", TableRoute);
    app.use("/payment", PaymentRoute);
    app.use("/donhang", DonHangRoute);
    app.use("/chitietdonhang", ChiTietDonHangRoute);
    app.use("/ingredient", IngredientRoute);
    app.use("/supplier", SupplierRoute);
    app.use("/user", UserRoute);
}

module.exports = routes