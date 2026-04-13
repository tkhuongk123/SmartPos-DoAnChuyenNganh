const db = require("../config/db");

class LoaiSanPhamController {
    layDs(req, res, next) {
        const query = "SELECT * FROM food_categories";
        db.query(query, (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy danh sách loai thành công",
                    dsLoaiSanPham: result
                })
            }
        })
    }



    them(req, res, next) {
        const { ten, mota } = req.body
        const checkTenLoaiSanPham = /[~`!@#$%^&*()_\-+={}\[\]|\\:;"'<>,.?/]/.test(ten);


        if (checkTenLoaiSanPham) {
            return res.status(200).json({
                inputInvalid: "ten",
                messageInvalid: "Tên loại sản phẩm không hợp lệ"
            })
        }

        const queryCheckTenSanPham = "SELECT * FROM food_categories WHERE food_category_name = ?";
        db.query(queryCheckTenSanPham, [ten], (error, results) => {
            if (error) {
                return res.status(400).json({ 
                    error: error,
                    message: "Loi!"
                 });
            }
            if (results.length > 0) 
            {
                return res.status(200).json({
                    inputInvalid: "ten",
                    messageInvalid: "Tên loại sản phẩm đã tồn tại"
                });
            }
            const query = "INSERT INTO food_categories (food_category_name) VALUES (?)"
            const values = [ten, mota]
            db.query(query, values, (error, result, field) => {
                if (error) 
                {
                    return res.status(400).json({
                        error: error
                    })
                } 
                else 
                {
                    return res.status(200).json({
                        message: "Thêm loại sản phẩm thành công",
                        loaiSanPham: result.insertId
                    })
                }
            });
        });
    }

    sua(req, res, next) {
        const { ten, mota, id } = req.body
        const checkTenLoaiSanPham = /[~`!@#$%^&*()_\-+={}\[\]|\\:;"'<>,.?/]/.test(ten);

        if (checkTenLoaiSanPham) {
            return res.status(200).json({
                inputInvalid: "ten",
                messageInvalid: "Tên loại sản phẩm không hợp lệ"
            })
        }

        const queryCheckTenSanPham = "SELECT * FROM food_categories WHERE food_category_name = ? and food_category_id != ?";
        db.query(queryCheckTenSanPham, [ten, id], (error, results) => {
            if (results.length > 0) {
                return res.status(200).json({
                    inputInvalid: "ten",
                    messageInvalid: "Tên loại sản phẩm đã tồn tại"
                });
            }
            const query = "UPDATE food_categories SET food_category_name=? WHERE food_category_id=?"
            const values = [ten, mota, id]
            db.query(query, values, (error, result, field) => {
                if (error) {
                    return res.status(400).json({
                        error: error
                    })
                } else {
                    return res.status(200).json({
                        message: "Sửa loại sản phẩm thành công",
                        taiKhoan: true
                    })
                }
            });
        });
    }

    xoa(req, res, next) {
        const { id } = req.body
        const query = "DELETE FROM food_categories WHERE food_category_id=?"
        const values = [id]
        db.query(query, values, (error, result, field) => {
            if (error) {
                return res.status(200).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Xóa loại sản phẩm thành công",
                    loaiSanPham: true
                })
            }
        });
    }

    layDsLoaiSanPham(req, res, next) {
        const query = `SELECT * FROM Food_Categories ORDER BY food_category_id DESC`;

        db.query(query, (error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            }
            return res.status(200).json({
                message: "Lấy danh sách loại sản phẩm thành công",
                data: result
            });
        });
    }

    tongLoaiSanPham(req, res, next) {
        const query = `SELECT COUNT(*) as total FROM Food_Categories WHERE is_active = 1`;

        db.query(query, (error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            }
            return res.status(200).json({
                message: "Thống kê tổng số loại sản phẩm thành công",
                total: result[0].total
            });
        });
    }

    themLoaiSanPham(req, res, next) {
        const { food_category_name, description, is_active } = req.body;
                const activeStatus = is_active === false ? 0 : 1;

        const query = `INSERT INTO Food_Categories (food_category_name, description, is_active) VALUES (?, ?, ?)`;

        db.query(query, [food_category_name, description || null, activeStatus], (error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            }
            return res.status(200).json({
                message: "Thêm loại sản phẩm thành công",
                insertId: result.insertId
            });
        });
    }

    suaLoaiSanPham(req, res, next) {
    const { food_category_id, food_category_name, description, is_active } = req.body;
    const query = `UPDATE Food_Categories SET food_category_name = ?, description = ?, is_active = ? WHERE food_category_id = ?`;
    
    const activeStatus = is_active === true || is_active === 1 ? 1 : 0;

    db.query(query, [food_category_name, description || null, activeStatus, food_category_id], (error, result) => {
        if (error) {
            return res.status(400).json({ error: error });
        }
        return res.status(200).json({
            message: 'Cập nhật loại sản phẩm thành công'
        });
    });
}

    xoaLoaiSanPham(req, res, next) {
        const { food_category_id } = req.body;
        const query = `UPDATE Food_Categories SET is_active = 0 WHERE food_category_id = ?`;

        db.query(query, [food_category_id], (error, result) => {
            if (error) {
                return res.status(400).json({ error: error });
            }
            return res.status(200).json({
                message: "Xóa loại sản phẩm thành công"
            });
        });
    }
}

module.exports = new LoaiSanPhamController()
