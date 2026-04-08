
INSERT INTO Users (name, username, password, role) VALUES
('Nguyen Van A', 'kitchen01', '123456', 'KITCHEN'),
('Tran Thi B', 'cashier01', '123456', 'CASHIER'),
('Le Van C', 'manager01', '123456', 'MANAGER');


INSERT INTO Table_Areas (table_area_name) VALUES
('Tầng trệt'),
('Tầng 1'),
('Sân vườn');

INSERT INTO Tables (table_area_id, table_name) VALUES
(1, 'TR1'),
(1, 'TR2'),
(1, 'TR3'),
(1, 'TR4'),
(1, 'TR5'),
(1, 'TR6'),
(1, 'TR7'),
(1, 'TR8'),
(2, 'T1-01'),
(2, 'T1-02'),
(2, 'T1-03'),
(2, 'T1-04'),
(3, 'SV-01'),
(3, 'SV-02'),
(3, 'SV-03');

INSERT INTO Food_Categories (food_category_name) VALUES
('Món chính'),
('Nước uống'),
('Tráng miệng');

INSERT INTO Foods (food_category_id, food_name, price, description) VALUES
(1, 'Cơm chiên hải sản', 65000, 'Cơm chiên với tôm và mực'),
(1, 'Phở bò', 50000, 'Phở bò truyền thống'),
(2, 'Trà đào', 30000, 'Trà đào cam sả'),
(2, 'Cà phê sữa', 25000, 'Cà phê sữa đá'),
(3, 'Bánh flan', 20000, 'Bánh flan caramel');


INSERT INTO Ingredients (ingredient_name, unit, stock_quantity) VALUES
('Gạo', 'kg', 100),
('Tôm', 'kg', 20),
('Mực', 'kg', 15),
('Thịt bò', 'kg', 30),
('Bánh phở', 'kg', 40),
('Đào', 'kg', 10),
('Cà phê', 'kg', 5),
('Sữa đặc', 'lon', 50),
('Trứng', 'quả', 200);

INSERT INTO Food_BOM (food_id, ingredient_id, quantity) VALUES

(1, 1, 0.2),
(1, 2, 0.1),
(1, 3, 0.1),


(2, 4, 0.15),
(2, 5, 0.2),

(3, 6, 0.05),


(4, 7, 0.02),
(4, 8, 0.1),


(5, 9, 2);


INSERT INTO Suppliers (supplier_name, phone, address) VALUES
('Công ty Hải Sản Tươi', '0901111111', 'TP.HCM'),
('Công ty Nông Sản Sạch', '0902222222', 'Đồng Nai');


INSERT INTO Ingredient_Import_Receipts (supplier_id, created_by, total_amount, note) VALUES
(1, 3, 5000000, 'Nhập hải sản tháng 6'),
(2, 3, 3000000, 'Nhập rau củ tháng 6');

INSERT INTO Ingredient_Import_Details (receipt_id, ingredient_id, quantity, price) VALUES
(1, 2, 10, 300000),
(1, 3, 5, 250000),
(2, 1, 50, 15000),
(2, 4, 20, 200000);


INSERT INTO Orders (table_id, total_amount, order_status, order_method) VALUES
(1, 95000, 'SERVED', 'DINE_IN'),
(2, 50000, 'PENDING', 'DINE_IN');
 

INSERT INTO Order_Details (order_id, food_id, quantity, price) VALUES
(1, 1, 1, 65000),
(1, 3, 1, 30000),
(2, 2, 1, 50000);


