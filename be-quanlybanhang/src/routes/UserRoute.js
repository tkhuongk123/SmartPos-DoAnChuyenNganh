const express = require('express');
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get('/layDsUser', UserController.layDsUser);
router.get('/layUser/:user_id', UserController.layUser);
router.get('/tongUser', UserController.tongUser);
router.get('/tongUserTheoRole', UserController.tongUserTheoRole);
router.post('/them', UserController.them);
router.post('/sua', UserController.sua);
router.post('/xoa', UserController.xoa);
router.post('/doiMatKhau', UserController.doiMatKhau);
router.post('/resetMatKhau', UserController.resetMatKhau);

module.exports = router;
