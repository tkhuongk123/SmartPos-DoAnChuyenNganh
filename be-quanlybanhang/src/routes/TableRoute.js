const express = require('express');
const router = express.Router();
const TableController = require("../controllers/TableController.js");

router.get('/getTables', TableController.getTables);
router.get('/getAreas', TableController.getAreas);
router.get('/getTableById/:tableId', TableController.getTableById);
router.get('/getTableAreaByTableId/:tableId', TableController.getTableAreaByTableId);
router.post('/updateTableStatus', TableController.updateTableStatus);

module.exports = router;

