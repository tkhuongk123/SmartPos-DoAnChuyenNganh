const express = require('express');
const router = express.Router();
const SupplierController = require("../controllers/SupplierController");

router.get('/layDsSupplier', SupplierController.layDsSupplier);
router.get('/laySupplier/:supplier_id', SupplierController.laySupplier);
router.get('/tongSupplier', SupplierController.tongSupplier);
router.post('/them', SupplierController.them);
router.post('/sua', SupplierController.sua);
router.post('/xoa', SupplierController.xoa);

module.exports = router;
