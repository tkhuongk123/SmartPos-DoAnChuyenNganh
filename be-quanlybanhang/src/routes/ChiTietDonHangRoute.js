const express = require('express');
const router = express.Router();
const ChiTietDonHangController = require("../controllers/ChiTietDonHangController");

router.post('/taoChiTiet', ChiTietDonHangController.taoChiTiet);
router.post('/layChiTietTheoDon', ChiTietDonHangController.layChiTietTheoDon);
module.exports = router;

