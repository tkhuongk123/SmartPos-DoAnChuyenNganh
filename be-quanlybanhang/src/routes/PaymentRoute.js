const express = require('express');
const router = express.Router();
const PaymentController = require("../controllers/PaymentController.js");

router.post('/thanhToan', PaymentController.thanhToan);


module.exports = router;

