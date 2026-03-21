const express = require('express');
const router = express.Router();
const SanPhamController = require("../controllers/SanPhamController.js");

router.post('/laySanPhamTheoLoai', SanPhamController.laySanPhamTheoLoai);
router.post('/laySanPhamTheoId', SanPhamController.laySanPhamTheoId);
router.get('/layDsSanPham', SanPhamController.layDsSanPham);
router.get('/tongSanPham', SanPhamController.tongSanPham);
router.post('/uploadImage', SanPhamController.uploadImage);
module.exports = router;

