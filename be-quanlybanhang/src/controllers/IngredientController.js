const db = require("../config/db");

class IngredientController {
  
    layDsIngredient(req, res, next) {
        const query = "SELECT * FROM Ingredients WHERE is_active = 1 OR is_active IS NULL ORDER BY ingredient_name ASC";
        
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

    createIngredient(req, res) {
        const { ingredient_name, unit, stock_quantity } = req.body;
        const query = "INSERT INTO Ingredients (ingredient_name, unit, stock_quantity) VALUES (?, ?, ?)";
        
        db.query(query, [ingredient_name, unit, stock_quantity || 0], (error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            }
            return res.status(201).json({
                message: "Thêm nguyên liệu thành công",
                success: true
            });
        });
    }

    updateIngredient(req, res) {
        const { id } = req.params;
        const { ingredient_name, unit, stock_quantity } = req.body;
        const query = "UPDATE Ingredients SET ingredient_name = ?, unit = ?, stock_quantity = ? WHERE ingredient_id = ?";
        
        db.query(query, [ingredient_name, unit, stock_quantity, id], (error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            }
            return res.status(200).json({
                message: "Cập nhật nguyên liệu thành công",
                success: true
            });
        });
    }

    deleteIngredient(req, res) {
        const { id } = req.params;
        const query = "UPDATE Ingredients SET is_active = 0 WHERE ingredient_id = ?";
        
        db.query(query, [id], (error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            }
            return res.status(200).json({
                message: "Xóa nguyên liệu thành công",
                success: true
            });
        });
    }
}

module.exports = new IngredientController()
