const db = require("../config/db");

class DonHangController {
    taoDonHang(req, res, next) {
        const io = req.app.get("io");
        const { table_id, total_amount, order_method, note } = req.body;

        const insertQuery = `
            INSERT INTO orders (table_id, total_amount, order_method, note)
            VALUES (?, ?, ?, ?)
        `;

        const values = [table_id, total_amount, order_method, note];

        db.query(insertQuery, values, (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: error
                });
            }

            const orderId = result.insertId;

            const selectQuery = `SELECT * FROM orders WHERE order_id = ?`;

            db.query(selectQuery, [orderId], (err, rows) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    });
                }

                const order = rows[0];

                return res.status(200).json({
                    message: "Thanh toán thành công",
                    data: order
                });
            });
        });
    }

    layDanhSach(req, res, next) {
        const query = "SELECT * from orders"
        db.query(query, (error, result, field) => {
            if(error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy danh sách thành công",
                    data: result
                })
            }
        }); 
    }

    layDanhSachTheoNgay(req, res, next) {
        const query = `
            SELECT * 
            FROM Orders
            WHERE DATE(created_at) = CURDATE()
            ORDER BY created_at DESC
        `;

        db.query(query, (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: error
                });
            } else {
                return res.status(200).json({
                    message: "Lấy danh sách theo ngày thành công",
                    data: result
                });
            }
        });
    }

    layDanhSachTheoOrderMethod(req, res, next) {
        const {order_method} = req.body;
        const query = "SELECT * from orders where order_method=?";
        const values = [order_method];
        db.query(query, values, (error, result, field) => {
            if(error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy đơn hàng theo id thành công",
                    data: result
                })
            }
        }); 
    }

    layDonHangTheoId(req, res, next) {
        const {order_id} = req.body
        const query = "SELECT * from orders where order_id=?"
        const values = [order_id]
        db.query(query, values, (error, result, field) => {
            if(error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy đơn hàng theo id thành công",
                    data: result[0]
                })
            }
        }); 
    }


    updateOrderStatus(req, res, next) {
        const { order_id, order_status } = req.body;

        const updateQuery = "UPDATE orders SET order_status=? WHERE order_id=?";
        const values = [order_status, order_id];

        db.query(updateQuery, values, (error) => {
            if (error) {
                return res.status(400).json({ error });
            }
            const selectQuery = "SELECT * FROM orders WHERE order_id=?";

            db.query(selectQuery, [order_id], (err, result) => {
                if (err) {
                    return res.status(400).json({ error: err });
                }

                return res.status(200).json({
                    message: "Sửa thành công",
                    isUpdated: true,
                    order: result[0]
                });
            });
        });
    }
}

module.exports = new DonHangController()
