const express = require('express');
const router = express.Router();
const LoaiSanPhamController = require("../controllers/LoaiSanPhamController.js");

router.get('/layDs', LoaiSanPhamController.layDs);
router.post('/them', LoaiSanPhamController.them);
router.post('/sua', LoaiSanPhamController.sua);
router.post('/xoa', LoaiSanPhamController.xoa);
router.get('/layDsLoaiSanPham', LoaiSanPhamController.layDsLoaiSanPham);
router.get('/tongLoaiSanPham', LoaiSanPhamController.tongLoaiSanPham);
router.post('/themLoaiSanPham', LoaiSanPhamController.themLoaiSanPham);
router.post('/suaLoaiSanPham', LoaiSanPhamController.suaLoaiSanPham);
router.post('/xoaLoaiSanPham', LoaiSanPhamController.xoaLoaiSanPham);
module.exports = router;

