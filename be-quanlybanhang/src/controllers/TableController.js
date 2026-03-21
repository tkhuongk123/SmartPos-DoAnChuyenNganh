const db = require("../config/db");

class TableController {

    getTables(req, res, next) {
        const query = "SELECT * FROM tables";
        db.query(query, (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy danh sách bàn thành công",
                    data: result
                })
            }
        })
    }

    getAreas(req, res, next) {
        const query = "SELECT * FROM table_areas";
        db.query(query, (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy danh sách khu vực thành công",
                    data: result
                })
            }
        })
    }

    getTableById(req, res, next) {
        const { table_id } = req.query;
        const query = "SELECT * FROM tables where table_id = ?";
        db.query(query, [table_id], (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy bàn theo id thành công",
                    data: result[0]
                })
            }
        })
    }

    getTableAreaByTableId(req, res, next) {
        const { table_id } = req.query;

        const query = `
            SELECT 
                t.*, 
                ta.table_area_name
            FROM Tables t
            JOIN Table_Areas ta 
                ON t.table_area_id = ta.table_area_id
            WHERE t.table_id = ?
        `;

        db.query(query, [table_id], (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: error
                });
            } else {
                return res.status(200).json({
                    message: "Lấy bàn + khu vực thành công",
                    data: result[0]
                });
            }
        });
    }

    updateTableStatus(req, res, next) {
        const { table_id, table_status } = req.body;

        const query = "UPDATE tables SET table_status=? WHERE table_id=?";
        db.query(query, [table_status, table_id], (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Update table status thành công",
                    isUpdated: true
                })
            }
        })
    }

    
}

module.exports = new TableController();
