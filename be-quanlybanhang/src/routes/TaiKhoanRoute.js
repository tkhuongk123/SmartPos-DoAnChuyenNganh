const express = require('express');
const router = express.Router();
const TaiKhoanController = require("../controllers/TaiKhoanController.js");

router.post('/login', TaiKhoanController.login);
router.post('/layTaiKhoan', TaiKhoanController.layTaiKhoan);
router.get('/layDsTaiKhoan', TaiKhoanController.layDsTaiKhoan);
router.get('/tongTaiKhoan', TaiKhoanController.tongTaiKhoan);
router.post('/them', TaiKhoanController.them);
router.post('/sua', TaiKhoanController.sua);
router.post('/xoa', TaiKhoanController.xoa);
module.exports = router;

