const db = require("../config/db");

class ChiTietDonHangController {
    taoChiTiet(req, res, next) {
        const {	order_id, food_id, quantity, price, note } = req.body
        const query = "INSERT INTO order_details (order_id, food_id, quantity, price, note) VALUES (?, ?, ?, ?, ?)"
        const values = [order_id, food_id, quantity, price, note]
        db.query(query, values, (error, result, field) => {
            if(error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Tạo chi tiết thành công",
                    isAddOrderDetail: true
                })
            }
        });
    }

    layChiTietTheoDon(req, res, next) {
        const {order_id} = req.body
        const query = "SELECT * from order_details where order_id=?"
        const values = [order_id]
        db.query(query, values, (error, result, field) => {
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
}

module.exports = new ChiTietDonHangController()
