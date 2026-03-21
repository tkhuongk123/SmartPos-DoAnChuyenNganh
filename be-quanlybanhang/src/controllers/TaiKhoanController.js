const db = require("../config/db");

class TaiKhoanController {
    login(req, res, next) {
        const { username, password } = req.body;
        const query = "SELECT * FROM users WHERE username=? and password=?";
        const values = [
            username,
            password
        ]
        db.query(query, values, (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else if (result.length === 0) {
                return res.status(200).json({
                    error: "Tài khoản hoặc mật khẩu không chính xác"
                })
            } else {
                return res.status(200).json({
                    message: "Đăng nhập thành công",
                    taiKhoan: result[0]
                })
            }
        })
    }

    layTaiKhoan(req, res, next) {
        const { id } = req.body;
        const query = "SELECT * FROM taikhoan WHERE id=?";
        const values = [
            id
        ]
        db.query(query, values, (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Đăng nhập thành công",
                    taiKhoan: result[0]
                })
            }
        })
    }

    layDsTaiKhoan(req, res, next) {
        const query = "SELECT * FROM taikhoan";
        db.query(query, (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Đăng nhập thành công",
                    dsTaiKhoan: result
                })
            }
        })
    }

    tongTaiKhoan(req, res, next) {
        const query = "SELECT COUNT(*) as tongTaiKhoan FROM taikhoan";
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
                    message: "Lấy tổng tài khoản thành công",
                    tongTaiKhoan: result[0].tongTaiKhoan
                })
            }
        })
    }




    them(req, res, next) {
        const { tendangnhap, tennguoidung, email, sodienthoai, idquyen } = req.body

        const checkTennguoidung = /[~`!@#$%^&*()_\-+={}\[\]|\\:;"'<>,.?/]/.test(tennguoidung);
        const checkTendangnhap = /[~`!@#$%^&*()_\-+={}\[\]|\\:;"'<>,.?/]/.test(tendangnhap);
        const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const checkSodienthoai = /^[0-9]+$/.test(sodienthoai);

        if (checkTennguoidung) {
            return res.status(200).json({
                inputInvalid: "tennguoidung",
                messageInvalid: "Tên người dùng không hợp lệ"
            })
        }
        else if (checkTendangnhap) {
            return res.status(200).json({
                inputInvalid: "tendangnhap",
                messageInvalid: "Tên đăng nhập không hợp lệ"
            })
        }
        else if (!checkEmail) {
            return res.status(200).json({
                inputInvalid: "email",
                messageInvalid: "Email không hợp lệ"
            })
        }
        else if (!checkSodienthoai) {
            return res.status(200).json({
                inputInvalid: "sodienthoai",
                messageInvalid: "Số điện thoại không hợp lệ"
            })
        }

        const queryCheckTendangnhap = "SELECT * FROM taikhoan WHERE tendangnhap = ?";
        db.query(queryCheckTendangnhap, [tendangnhap], (error, results) => {
            if (results.length > 0) {
                return res.status(200).json({
                    inputInvalid: "tendangnhap",
                    messageInvalid: "Tên đăng nhập đã tồn tại"
                });
            }

            const queryCheckEmail = "SELECT * FROM taikhoan WHERE email = ?";
            db.query(queryCheckEmail, [email], (error, results) => {
                if (results.length > 0) {
                    return res.status(200).json({
                        inputInvalid: "email",
                        messageInvalid: "Email đã tồn tại"
                    });
                }
                const query = "INSERT INTO taikhoan (tendangnhap, tennguoidung, email, matkhau, sodienthoai, idquyen, diemtichluy) VALUES (?, ?, ?, ?, ?, ?, ?)";
                const values = [tendangnhap, tennguoidung, email, '123456', sodienthoai, idquyen, 0];

                db.query(query, values, (error, result) => {
                    if (error) {
                        return res.status(400).json({ error });
                    } else {
                        return res.status(200).json({
                            message: "Thêm tài khoản thành công",
                            taiKhoan: result.insertId
                        });
                    }
                });
            });
        });
    }

    sua(req, res, next) {
        const { id, tennguoidung, email, sodienthoai } = req.body
        const checkTennguoidung = /[~`!@#$%^&*()_\-+={}\[\]|\\:;"'<>,.?/]/.test(tennguoidung);
        const checkEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const checkSodienthoai = /^[0-9]+$/.test(sodienthoai);

        if (checkTennguoidung) {
            return res.status(200).json({
                inputInvalid: "tennguoidung",
                messageInvalid: "Tên người dùng không hợp lệ"
            })
        }
        else if (!checkEmail) {
            return res.status(200).json({
                inputInvalid: "email",
                messageInvalid: "Email không hợp lệ"
            })
        }
        else if (!checkSodienthoai) {
            return res.status(200).json({
                inputInvalid: "sodienthoai",
                messageInvalid: "Số điện thoại không hợp lệ"
            })
        }


        const queryCheckEmail = "SELECT * FROM taikhoan WHERE email = ? and id != ?";
        db.query(queryCheckEmail, [email, id], (error, results) => {
            if (results.length > 0) {
                return res.status(200).json({
                    inputInvalid: "email",
                    messageInvalid: "Email đã tồn tại"
                });
            }

            const query = "UPDATE taikhoan SET tennguoidung=?, email=?, sodienthoai=? WHERE id=?"
            const values = [tennguoidung, email, sodienthoai, id]
            db.query(query, values, (error, result, field) => {
                if (error) {
                    return res.status(400).json({
                        error: error
                    })
                } else {
                    return res.status(200).json({
                        message: "Sửa tài khoản thành công",
                        taiKhoan: true
                    })
                }
            });
        });
    }

    xoa(req, res, next) {
        const { id } = req.body
        const query = "DELETE FROM taikhoan WHERE id=?"
        const values = [id]
        db.query(query, values, (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Xóa tài khoản thành công",
                    taiKhoan: true
                })
            }
        });
    }
}

module.exports = new TaiKhoanController()
