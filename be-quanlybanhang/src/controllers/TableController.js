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
        const query = "SELECT * FROM table_areas WHERE is_active = 1";
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

    createTable(req, res) {
    const { table_name, table_area_id } = req.body;

    const query = "INSERT INTO tables (table_name, table_area_id) VALUES (?, ?)";

    db.query(query, [table_name, table_area_id], (error, result) => {
        if (error) {
            return res.status(400).json({ error });
        }

        return res.status(200).json({
            message: "Thêm bàn thành công"
        });
    });
    }

    updateTable(req, res) {
    const { table_id, table_name, table_area_id } = req.body;

    const query = `
        UPDATE tables 
        SET table_name = ?, table_area_id = ?
        WHERE table_id = ?
    `;

    db.query(query, [table_name, table_area_id, table_id], (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        return res.status(200).json({
            message: "Cập nhật bàn thành công"
        });
    });

}

deleteTable(req, res) {
    const { id } = req.params;

    const query = "DELETE FROM tables WHERE table_id = ?";

    db.query(query, [id], (error) => {
        if (error) {
            return res.status(400).json({ error });
        }

        return res.status(200).json({
            message: "Xóa bàn thành công"
        });
    });
}


createArea(req, res) {
    const { table_area_name } = req.body;

    const query = "INSERT INTO table_areas (table_area_name) VALUES (?)";

    db.query(query, [table_area_name], (err) => {
        if (err) return res.status(400).json({ err });

        res.json({ message: "Thêm khu vực thành công" });
    });
}


updateArea(req, res) {
    const { table_area_id, table_area_name } = req.body;

    const query = `
        UPDATE table_areas 
        SET table_area_name = ?
        WHERE table_area_id = ?
    `;

    db.query(query, [table_area_name, table_area_id], (err) => {
        if (err) return res.status(400).json({ err });

        res.json({ message: "Cập nhật khu vực thành công" });
    });
}


deleteArea(req, res) {
    const { id } = req.params;

    const query = `
        UPDATE table_areas 
        SET is_active = 0 
        WHERE table_area_id = ?
    `;

    db.query(query, [id], (err) => {
        if (err) return res.status(400).json({ err });

        res.json({ message: "Xóa khu vực thành công" });
    });
}
}



module.exports = new TableController();
