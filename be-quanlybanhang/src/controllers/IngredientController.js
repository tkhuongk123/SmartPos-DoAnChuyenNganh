const db = require("../config/db");

class IngredientController {
  
    layDsIngredient(req, res, next) {
        const query = "SELECT * FROM Ingredients ORDER BY ingredient_name ASC";
        db.query(query, (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: error
                });
            } else {
                return res.status(200).json({
                    message: "Lấy danh sách nguyên liệu thành công",
                    ingredients: result
                });
            }
        });
    }

    // Trừ nguyên liệu khi đơn đã nấu xong
    deductIngredients(req, res, next) {
        const { order_id } = req.body;

        const query = `
            SELECT od.food_id, od.quantity AS order_qty, 
                fb.ingredient_id, fb.quantity AS ingredient_qty
            FROM Order_Details od
            JOIN Food_BOM fb ON od.food_id = fb.food_id
            WHERE od.order_id = ?
        `;

        db.query(query, [order_id], (err, results) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }

            // Nếu không có dữ liệu
            if (!results || results.length === 0) {
                return res.status(200).json({
                    message: "Không có nguyên liệu cần trừ",
                    success: true
                });
            }

            // Tạo list update
            const updates = results.map(item => {
                return new Promise((resolve, reject) => {
                    const totalDeduct = item.order_qty * item.ingredient_qty;

                    db.query(
                        `UPDATE Ingredients 
                        SET stock_quantity = stock_quantity - ? 
                        WHERE ingredient_id = ?`,
                        [totalDeduct, item.ingredient_id],
                        (err2) => {
                            if (err2) return reject(err2);
                            resolve();
                        }
                    );
                });
            });

            Promise.all(updates)
                .then(() => {
                    return res.status(200).json({
                        message: "Trừ nguyên liệu thành công",
                        success: true
                    });
                })
                .catch(error => {
                    return res.status(500).json({
                        error: error
                    });
                });
        });
    }
}

module.exports = new IngredientController()
