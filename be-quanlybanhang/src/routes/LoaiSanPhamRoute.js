const express = require('express');
const router = express.Router();
const LoaiSanPhamController = require("../controllers/LoaiSanPhamController.js");

router.get('/layDs', LoaiSanPhamController.layDs);
router.get('/tongLoaiSanPham', LoaiSanPhamController.tongLoaiSanPham);
router.post('/them', LoaiSanPhamController.them);
router.post('/sua', LoaiSanPhamController.sua);
router.post('/xoa', LoaiSanPhamController.xoa);
module.exports = router;

