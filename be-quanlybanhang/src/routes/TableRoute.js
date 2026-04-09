const express = require('express');
const router = express.Router();
const TableController = require("../controllers/TableController.js");

router.get('/getTables', TableController.getTables);
router.get('/getAreas', TableController.getAreas);
router.get('/getTableById/:tableId', TableController.getTableById);
router.get('/getTableAreaByTableId/:tableId', TableController.getTableAreaByTableId);
router.post('/updateTableStatus', TableController.updateTableStatus);
router.post('/createTable', TableController.createTable);
router.put('/updateTable', TableController.updateTable);
router.delete('/deleteTable/:id', TableController.deleteTable);
router.post('/createArea', TableController.createArea);
router.post('/updateArea', TableController.updateArea);
router.delete('/deleteArea/:id', TableController.deleteArea);
module.exports = router;

