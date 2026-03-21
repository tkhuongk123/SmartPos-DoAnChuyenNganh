const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../config/db");

class SanPhamController {

    uploadImage(req, res, next) {
        // Cấu hình lưu file
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const folder = req.query.folder || "default";
                const uploadPath = path.join(__dirname, `../../public/uploads/${folder}`);
                // Nếu folder chưa tồn tại thì tạo
                if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                // const id = req.query.id;
                // const ext = path.extname(file.originalname); 
                cb(null, file.originalname);
            },
        });

        const upload = multer({ storage }).single("file");

        // Gọi middleware upload
        upload(req, res, function (err) {
            if (err) {
                return res.status(400).json({ error: "Upload thất bại", details: err });
            }

            if (!req.file) {
                return res.status(400).json({ error: "Không có file nào được chọn" });
            }

            // Trả về đường dẫn ảnh
            res.json({
                message: "Upload thành công",
                url: `/images/${req.file.filename}`,
            });
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

    

}

module.exports = new SanPhamController()
