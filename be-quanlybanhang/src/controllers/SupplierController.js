const db = require("../config/db");

class SupplierController {
   
    layDsSupplier(req, res, next) {
        const query = "SELECT * FROM Suppliers WHERE is_active = 1 ORDER BY supplier_id DESC";
        db.query(query, (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy danh sách nhà cung cấp thành công",
                    suppliers: result
                })
            }
        })
    }

    laySupplier(req, res, next) {
        const { supplier_id } = req.params;
        const query = "SELECT * FROM Suppliers WHERE supplier_id=?";
        db.query(query, [supplier_id], (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else if (result.length === 0) {
                return res.status(404).json({
                    error: "Không tìm thấy nhà cung cấp"
                })
            } else {
                return res.status(200).json({
                    message: "Lấy thông tin nhà cung cấp thành công",
                    supplier: result[0]
                })
            }
        })
    }

    them(req, res, next) {
        const { supplier_name, phone, address, is_active } = req.body;

        // Validate
        if (!supplier_name || !phone || !address) {
            return res.status(400).json({
                error: "Vui lòng điền đầy đủ thông tin"
            })
        }

        const checkPhone = /^[0-9]{10}$/.test(phone);
        if (!checkPhone) {
            return res.status(400).json({
                inputInvalid: "phone",
                messageInvalid: "Số điện thoại không hợp lệ (phải 10 chữ số)"
            })
        }

        // Check trùng số điện thoại
        const queryCheckPhone = "SELECT * FROM Suppliers WHERE phone = ?";
        db.query(queryCheckPhone, [phone], (error, results) => {
            if (error) {
                return res.status(400).json({ error });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    inputInvalid: "phone",
                    messageInvalid: "Số điện thoại đã tồn tại"
                });
            }

            // Insert
            const query = "INSERT INTO Suppliers (supplier_name, phone, address, is_active) VALUES (?, ?, ?, ?)";
            const values = [supplier_name, phone, address, is_active !== undefined ? is_active : 1];

            db.query(query, values, (error, result) => {
                if (error) {
                    return res.status(400).json({ error });
                } else {
                    return res.status(200).json({
                        message: "Thêm nhà cung cấp thành công",
                        supplier_id: result.insertId
                    });
                }
            });
        });
    }

    sua(req, res, next) {
        const { supplier_id, supplier_name, phone, address, is_active } = req.body;

        if (!supplier_id || !supplier_name || !phone || !address) {
            return res.status(400).json({
                error: "Vui lòng điền đầy đủ thông tin"
            })
        }

        const checkPhone = /^[0-9]{10}$/.test(phone);
        if (!checkPhone) {
            return res.status(400).json({
                inputInvalid: "phone",
                messageInvalid: "Số điện thoại không hợp lệ (phải 10 chữ số)"
            })
        }

        // Check trùng số điện thoại (trừ chính nó)
        const queryCheckPhone = "SELECT * FROM Suppliers WHERE phone = ? AND supplier_id != ?";
        db.query(queryCheckPhone, [phone, supplier_id], (error, results) => {
            if (error) {
                return res.status(400).json({ error });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    inputInvalid: "phone",
                    messageInvalid: "Số điện thoại đã tồn tại"
                });
            }

            // Update
            const query = "UPDATE Suppliers SET supplier_name=?, phone=?, address=?, is_active=? WHERE supplier_id=?";
            const values = [supplier_name, phone, address, is_active !== undefined ? is_active : 1, supplier_id];

            db.query(query, values, (error, result) => {
                if (error) {
                    return res.status(400).json({ error });
                } else {
                    return res.status(200).json({
                        message: "Cập nhật nhà cung cấp thành công",
                        success: true
                    });
                }
            });
        });
    }

    xoa(req, res, next) {
        const { supplier_id } = req.body;

        if (!supplier_id) {
            return res.status(400).json({
                error: "Vui lòng cung cấp supplier_id"
            })
        }

        const query = "UPDATE Suppliers SET is_active = 0 WHERE supplier_id=?";
        db.query(query, [supplier_id], (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Xóa nhà cung cấp thành công",
                    success: true
                })
            }
        });
    }


    tongSupplier(req, res, next) {
        const query = "SELECT COUNT(*) as tongSupplier FROM Suppliers";
        db.query(query, (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy tổng nhà cung cấp thành công",
                    tongSupplier: result[0].tongSupplier
                })
            }
        })
    }
}

module.exports = new SupplierController();
