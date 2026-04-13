const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../config/db");

class SanPhamController {

    uploadImage(req, res) {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const folder = req.query.folder || "default";
                const uploadPath = path.join(__dirname, `../../public/uploads/${folder}`);
                if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + path.extname(file.originalname));
            },
        });
        const upload = multer({ storage }).single("file");
        upload(req, res, (err) => {
            if (err) return res.status(400).json({ error: "Upload thất bại" });
            if (!req.file) return res.status(400).json({ error: "Không có file" });
            res.status(200).json({ url: req.file.filename });
        });
    }

    
    laySanPhamTheoLoai(req, res, next) {
        const { food_category_id } = req.body;
        const query = "SELECT * FROM foods WHERE food_category_id=?";
        const values = [
            food_category_id
        ]
        db.query(query, values, (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy danh sách sản phẩm thành công",
                    dsSanPham: result
                })
            }
        })
    }

    laySanPhamTheoId(req, res, next) {
        const { food_id } = req.body;
        const query = "SELECT * FROM foods WHERE food_id=?";
        const values = [
            food_id
        ]
        db.query(query, values, (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy sản phẩm thành công",
                    data: result[0]
                })
            }
        })
    }

    layDsSanPham(req, res, next) {
        const query = "SELECT * FROM foods"
        db.query(query, (error, result, field) => {
            if (error) 
            {
                return res.status(400).json({
                    error: error
                })
            } 
            else 
            {
                return res.status(200).json({
                    message: "Lấy danh sách sản phẩm thành công",
                    dsSanPham: result
                })
            }
        });
    }

    tongSanPham(req, res, next) {
        const query = "SELECT COUNT(*) as tongSanPham FROM foods";
        db.query(query, (error, result, field) => {
            if (error) 
            {
                return res.status(400).json({
                    error: error
                })
            } 
            else 
            {
                return res.status(200).json({
                    message: "Lấy tổng sản phẩm thành công",
                    tongSanPham: result[0].tongSanPham
                })
            }
        })
    }

    updateFoodStatus(req, res, next) {
        const query = `
            UPDATE Foods
            SET food_status = CASE 
                WHEN food_id IN (
                    SELECT food_id FROM (
                        SELECT f.food_id
                        FROM Foods f
                        JOIN Food_BOM fb ON f.food_id = fb.food_id
                        JOIN Ingredients i ON fb.ingredient_id = i.ingredient_id
                        GROUP BY f.food_id
                        HAVING MIN(i.stock_quantity / fb.quantity) < 1
                    ) AS temp
                )
                THEN 'SOLD OUT'
                ELSE 'AVAILABLE'
            END
        `;

        db.query(query, (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: error
                });
            } else {
                return res.status(200).json({
                    message: "Cập nhật trạng thái món thành công",
                    success: true,
                    affectedRows: result.affectedRows
                });
            }
        });
    }

    createFood(req, res) {
        const { food_category_id, food_name, price, food_status, image, description } = req.body;
        const query = `INSERT INTO Foods (food_category_id, food_name, price, food_status, image, description) 
                       VALUES (?, ?, ?, ?, ?, ?)`;
        
        db.query(query, [food_category_id, food_name, price, food_status || 'AVAILABLE', image, description], (error, result) => {
            if (error) return res.status(400).json({ error });
            return res.status(201).json({ message: "Thêm món ăn thành công", success: true });
        });
    }

    updateFood(req, res) {
        const { id } = req.params;
        const { food_category_id, food_name, price, food_status, image, description } = req.body;
        const query = `UPDATE Foods SET food_category_id = ?, food_name = ?, price = ?, 
                       food_status = ?, image = ?, description = ? WHERE food_id = ?`;
        
        db.query(query, [food_category_id, food_name, price, food_status, image, description, id], (error, result) => {
            if (error) return res.status(400).json({ error });
            return res.status(200).json({ message: "Cập nhật thành công", success: true });
        });
    }

    deleteFood(req, res) {
        const { id } = req.params;
        const query = "UPDATE Foods SET is_active = 0 WHERE food_id = ?";
        db.query(query, [id], (error, result) => {
            if (error) return res.status(400).json({ error });
            return res.status(200).json({ message: "Xóa món ăn thành công", success: true });
        });
    }

}

module.exports = new SanPhamController()
