const db = require("../config/db");

class ImportController {

    layDsImport(req, res, next) {
        const query = `
            SELECT
                iir.receipt_id,
                iir.supplier_id,
                s.supplier_name,
                iir.created_by,
                u.name as created_by_name,
                iir.total_amount,
                iir.note,
                iir.created_at
            FROM Ingredient_Import_Receipts iir
            LEFT JOIN Suppliers s ON iir.supplier_id = s.supplier_id
            LEFT JOIN Users u ON iir.created_by = u.user_id
            ORDER BY iir.created_at DESC
        `;

        db.query(query, (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: error
                });
            } else {
                return res.status(200).json({
                    message: "Lấy danh sách phiếu nhập thành công",
                    imports: result
                });
            }
        });
    }


    layImport(req, res, next) {
        const { receipt_id } = req.params;

        const queryReceipt = `
            SELECT
                iir.receipt_id,
                iir.supplier_id,
                s.supplier_name,
                s.phone as supplier_phone,
                s.address as supplier_address,
                iir.created_by,
                u.name as created_by_name,
                iir.total_amount,
                iir.note,
                iir.created_at
            FROM Ingredient_Import_Receipts iir
            LEFT JOIN Suppliers s ON iir.supplier_id = s.supplier_id
            LEFT JOIN Users u ON iir.created_by = u.user_id
            WHERE iir.receipt_id = ?
        `;

        db.query(queryReceipt, [receipt_id], (error, receiptResult) => {
            if (error) {
                return res.status(400).json({
                    error: error
                });
            }

            if (receiptResult.length === 0) {
                return res.status(404).json({
                    error: "Không tìm thấy phiếu nhập"
                });
            }

            // Lấy chi tiết nguyên liệu
            const queryDetails = `
                SELECT
                    iid.receipt_detail_id,
                    iid.ingredient_id,
                    i.ingredient_name,
                    i.unit,
                    iid.quantity,
                    iid.price,
                    iid.subtotal
                FROM Ingredient_Import_Details iid
                LEFT JOIN Ingredients i ON iid.ingredient_id = i.ingredient_id
                WHERE iid.receipt_id = ?
            `;

            db.query(queryDetails, [receipt_id], (error2, detailsResult) => {
                if (error2) {
                    return res.status(400).json({
                        error: error2
                    });
                }

                return res.status(200).json({
                    message: "Lấy chi tiết phiếu nhập thành công",
                    import: {
                        ...receiptResult[0],
                        items: detailsResult
                    }
                });
            });
        });
    }

    taoPhieuNhap(req, res, next) {
        const { supplier_id, created_by, note, items } = req.body;

        // Validate
        if (!supplier_id || !created_by || !items || items.length === 0) {
            return res.status(400).json({
                error: "Vui lòng điền đầy đủ thông tin và thêm ít nhất một nguyên liệu"
            });
        }

        // Validate items
        for (let item of items) {
            if (!item.ingredient_id || !item.quantity || !item.price) {
                return res.status(400).json({
                    error: "Thông tin nguyên liệu không hợp lệ"
                });
            }
        }

        // Tính tổng tiền
        let total_amount = 0;
        items.forEach(item => {
            total_amount += parseFloat(item.quantity) * parseFloat(item.price);
        });

        // Insert phiếu nhập
        const queryReceipt = `
            INSERT INTO Ingredient_Import_Receipts (supplier_id, created_by, total_amount, note)
            VALUES (?, ?, ?, ?)
        `;

        db.query(queryReceipt, [supplier_id, created_by, total_amount, note], (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: error
                });
            }

            const receipt_id = result.insertId;

            // Insert chi tiết
            const queryDetails = `
                INSERT INTO Ingredient_Import_Details (receipt_id, ingredient_id, quantity, price)
                VALUES (?, ?, ?, ?)
            `;

            let completedInserts = 0;
            let hasError = false;

            items.forEach(item => {
                db.query(queryDetails, [receipt_id, item.ingredient_id, item.quantity, item.price], (error2) => {
                    if (error2 && !hasError) {
                        hasError = true;
                        // Rollback: xóa phiếu nhập đã tạo
                        db.query("DELETE FROM Ingredient_Import_Receipts WHERE receipt_id = ?", [receipt_id], () => {
                            return res.status(400).json({
                                error: "Lỗi khi thêm chi tiết nguyên liệu"
                            });
                        });
                        return;
                    }

                    completedInserts++;

                    // Nếu đã insert xong tất cả và không có lỗi
                    if (completedInserts === items.length && !hasError) {
                        // Cập nhật stock_quantity cho từng nguyên liệu
                        const updateStockPromises = items.map(item => {
                            return new Promise((resolve, reject) => {
                                db.query(
                                    `UPDATE Ingredients SET stock_quantity = stock_quantity + ? WHERE ingredient_id = ?`,
                                    [item.quantity, item.ingredient_id],
                                    (err) => {
                                        if (err) return reject(err);
                                        resolve();
                                    }
                                );
                            });
                        });

                        Promise.all(updateStockPromises)
                            .then(() => {
                                return res.status(200).json({
                                    message: "Tạo phiếu nhập thành công",
                                    receipt_id: receipt_id
                                });
                            })
                            .catch(error => {
                                return res.status(400).json({
                                    error: "Lỗi khi cập nhật tồn kho"
                                });
                            });
                    }
                });
            });
        });
    }

}

module.exports = new ImportController();
