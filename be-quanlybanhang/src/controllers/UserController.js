const db = require("../config/db");

class UserController {
    // Lấy danh sách nhân viên
    layDsUser(req, res, next) {
        const query = "SELECT user_id, name, username, role, is_active FROM Users ORDER BY user_id DESC";
        db.query(query, (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy danh sách nhân viên thành công",
                    users: result
                })
            }
        })
    }

    // Lấy 1 nhân viên theo ID
    layUser(req, res, next) {
        const { user_id } = req.params;
        const query = "SELECT user_id, name, username, role, is_active FROM Users WHERE user_id=?";
        db.query(query, [user_id], (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else if (result.length === 0) {
                return res.status(404).json({
                    error: "Không tìm thấy nhân viên"
                })
            } else {
                return res.status(200).json({
                    message: "Lấy thông tin nhân viên thành công",
                    user: result[0]
                })
            }
        })
    }

    // Thêm nhân viên
    them(req, res, next) {
        const { name, username, password, role, is_active } = req.body;

        // Validate
        if (!name || !username || !password || !role) {
            return res.status(400).json({
                error: "Vui lòng điền đầy đủ thông tin"
            })
        }

        // Validate username (không có ký tự đặc biệt)
        const checkUsername = /^[a-zA-Z0-9_]+$/.test(username);
        if (!checkUsername) {
            return res.status(400).json({
                inputInvalid: "username",
                messageInvalid: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
            })
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                inputInvalid: "password",
                messageInvalid: "Mật khẩu phải có ít nhất 6 ký tự"
            })
        }

        // Validate role
        const validRoles = ['KITCHEN', 'CASHIER', 'MANAGER'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                inputInvalid: "role",
                messageInvalid: "Vai trò không hợp lệ"
            })
        }

        // Check trùng username
        const queryCheckUsername = "SELECT * FROM Users WHERE username = ?";
        db.query(queryCheckUsername, [username], (error, results) => {
            if (error) {
                return res.status(400).json({ error });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    inputInvalid: "username",
                    messageInvalid: "Tên đăng nhập đã tồn tại"
                });
            }

            // Insert
            const query = "INSERT INTO Users (name, username, password, role, is_active) VALUES (?, ?, ?, ?, ?)";
            const values = [name, username, password, role, is_active !== undefined ? is_active : 1];

            db.query(query, values, (error, result) => {
                if (error) {
                    return res.status(400).json({ error });
                } else {
                    return res.status(200).json({
                        message: "Thêm nhân viên thành công",
                        user_id: result.insertId
                    });
                }
            });
        });
    }

    // Sửa nhân viên
    sua(req, res, next) {
        const { user_id, name, role, is_active } = req.body;

        if (!user_id || !name || !role) {
            return res.status(400).json({
                error: "Vui lòng điền đầy đủ thông tin"
            })
        }

        // Validate role
        const validRoles = ['KITCHEN', 'CASHIER', 'MANAGER'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                inputInvalid: "role",
                messageInvalid: "Vai trò không hợp lệ"
            })
        }

        // Update (không cho đổi username và password ở đây)
        const query = "UPDATE Users SET name=?, role=?, is_active=? WHERE user_id=?";
        const values = [name, role, is_active !== undefined ? is_active : 1, user_id];

        db.query(query, values, (error, result) => {
            if (error) {
                return res.status(400).json({ error });
            } else {
                return res.status(200).json({
                    message: "Cập nhật nhân viên thành công",
                    success: true
                });
            }
        });
    }

    // Xóa nhân viên
    xoa(req, res, next) {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({
                error: "Vui lòng cung cấp user_id"
            })
        }

        const query = "DELETE FROM Users WHERE user_id=?";
        db.query(query, [user_id], (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Xóa nhân viên thành công",
                    success: true
                })
            }
        });
    }

    // Đổi mật khẩu
    doiMatKhau(req, res, next) {
        const { user_id, password_old, password_new } = req.body;

        if (!user_id || !password_old || !password_new) {
            return res.status(400).json({
                error: "Vui lòng điền đầy đủ thông tin"
            })
        }

        if (password_new.length < 6) {
            return res.status(400).json({
                inputInvalid: "password_new",
                messageInvalid: "Mật khẩu mới phải có ít nhất 6 ký tự"
            })
        }

        // Check mật khẩu cũ
        const queryCheck = "SELECT * FROM Users WHERE user_id=? AND password=?";
        db.query(queryCheck, [user_id, password_old], (error, results) => {
            if (error) {
                return res.status(400).json({ error });
            }

            if (results.length === 0) {
                return res.status(400).json({
                    inputInvalid: "password_old",
                    messageInvalid: "Mật khẩu cũ không đúng"
                });
            }

            // Update password
            const queryUpdate = "UPDATE Users SET password=? WHERE user_id=?";
            db.query(queryUpdate, [password_new, user_id], (error, result) => {
                if (error) {
                    return res.status(400).json({ error });
                } else {
                    return res.status(200).json({
                        message: "Đổi mật khẩu thành công",
                        success: true
                    });
                }
            });
        });
    }

    // Reset mật khẩu (cho admin)
    resetMatKhau(req, res, next) {
        const { user_id, password_new } = req.body;

        if (!user_id || !password_new) {
            return res.status(400).json({
                error: "Vui lòng điền đầy đủ thông tin"
            })
        }

        if (password_new.length < 6) {
            return res.status(400).json({
                inputInvalid: "password_new",
                messageInvalid: "Mật khẩu mới phải có ít nhất 6 ký tự"
            })
        }

        const query = "UPDATE Users SET password=? WHERE user_id=?";
        db.query(query, [password_new, user_id], (error, result) => {
            if (error) {
                return res.status(400).json({ error });
            } else {
                return res.status(200).json({
                    message: "Reset mật khẩu thành công",
                    success: true
                });
            }
        });
    }

    // Đếm tổng số nhân viên
    tongUser(req, res, next) {
        const query = "SELECT COUNT(*) as tongUser FROM Users";
        db.query(query, (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy tổng nhân viên thành công",
                    tongUser: result[0].tongUser
                })
            }
        })
    }

    // Đếm theo role
    tongUserTheoRole(req, res, next) {
        const query = `
            SELECT
                role,
                COUNT(*) as count
            FROM Users
            GROUP BY role
        `;
        db.query(query, (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            } else {
                return res.status(200).json({
                    message: "Lấy thống kê nhân viên theo vai trò thành công",
                    data: result
                })
            }
        })
    }
}

module.exports = new UserController();
