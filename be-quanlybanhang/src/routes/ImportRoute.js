const express = require("express");
const router = express.Router();
const ImportController = require("../controllers/ImportController");

// Lấy danh sách phiếu nhập
router.get("/layDsImport", ImportController.layDsImport);

// Lấy chi tiết phiếu nhập
router.get("/layImport/:receipt_id", ImportController.layImport);

// Tạo phiếu nhập mới
router.post("/tao", ImportController.taoPhieuNhap);

module.exports = router;
