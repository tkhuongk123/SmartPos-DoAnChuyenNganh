const express = require('express');
const router = express.Router();
const SanPhamController = require("../controllers/SanPhamController.js");

router.post('/laySanPhamTheoLoai', SanPhamController.laySanPhamTheoLoai);
router.post('/laySanPhamTheoId', SanPhamController.laySanPhamTheoId);
router.get('/layDsSanPham', SanPhamController.layDsSanPham);
router.get('/tongSanPham', SanPhamController.tongSanPham);
router.post('/uploadImage', SanPhamController.uploadImage);
router.post('/updateFoodStatus', SanPhamController.updateFoodStatus);
router.post('/create', SanPhamController.createFood);
router.put('/update/:id', SanPhamController.updateFood);
router.delete('/delete/:id', SanPhamController.deleteFood);
module.exports = router;

