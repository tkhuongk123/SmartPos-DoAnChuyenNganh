const express = require('express');
const router = express.Router();
const DonHangController = require("../controllers/DonHangController.js");

router.post('/taoDonHang', DonHangController.taoDonHang);
router.get('/layDanhSach', DonHangController.layDanhSach);
router.get('/layDanhSachTheoNgay', DonHangController.layDanhSachTheoNgay);
router.post('/layDanhSachTheoOrderMethod', DonHangController.layDanhSachTheoOrderMethod);
router.post('/updateOrderStatus', DonHangController.updateOrderStatus);
router.post('/layDonHangTheoId', DonHangController.layDonHangTheoId);
module.exports = router;

