CREATE DATABASE IF NOT EXISTS smart_pos;
USE smart_pos;


-- 1. Users
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('KITCHEN', 'CASHIER', 'MANAGER'),
    is_active BOOLEAN DEFAULT 1
) ENGINE=InnoDB;

-- 2. Table Areas
CREATE TABLE Table_Areas (
    table_area_id INT PRIMARY KEY AUTO_INCREMENT,
    table_area_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT 1
) ENGINE=InnoDB;

-- 3. Tables
CREATE TABLE Tables (
    table_id INT PRIMARY KEY AUTO_INCREMENT,
    table_area_id INT NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    table_status ENUM('EMPTY', 'OCCUPIED') DEFAULT 'EMPTY',
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (table_area_id) REFERENCES Table_Areas(table_area_id)
) ENGINE=InnoDB;

-- 4. Food Categories (phải tạo trước Foods)
CREATE TABLE Food_Categories (
    food_category_id INT PRIMARY KEY AUTO_INCREMENT,
    food_category_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT 1
) ENGINE=InnoDB;

-- 5. Foods
CREATE TABLE Foods (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    food_category_id INT NOT NULL,
    food_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    food_status ENUM('AVAILABLE', 'SOLD OUT') DEFAULT 'AVAILABLE',
    image VARCHAR(255),
    description VARCHAR(500),
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (food_category_id) REFERENCES Food_Categories(food_category_id)
) ENGINE=InnoDB;

-- 6. Ingredients
CREATE TABLE Ingredients (
    ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
    ingredient_name VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    stock_quantity DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT 1
) ENGINE=InnoDB;

-- 7. Food BOM
CREATE TABLE Food_BOM (
    food_id INT,
    ingredient_id INT,
    quantity DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (food_id, ingredient_id),
    FOREIGN KEY (food_id) REFERENCES Foods(food_id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id)
) ENGINE=InnoDB;

-- 8. Suppliers
CREATE TABLE Suppliers (
    supplier_id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT 1
) ENGINE=InnoDB;

-- 9. Ingredient Import Receipts
CREATE TABLE Ingredient_Import_Receipts (
    receipt_id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_id INT NOT NULL,
    created_by INT NOT NULL,
    total_amount DECIMAL(12,2) DEFAULT 0,
    note VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id),
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
) ENGINE=InnoDB;

-- 10. Ingredient Import Details
CREATE TABLE Ingredient_Import_Details (
    receipt_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    receipt_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (quantity * price) STORED,
    FOREIGN KEY (receipt_id) REFERENCES Ingredient_Import_Receipts(receipt_id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id)
) ENGINE=InnoDB;

-- 11. Orders
CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    table_id INT DEFAULT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0,
    order_status ENUM('PENDING', 'COOKING', 'COOKED', 'SERVED', 'PAID', 'CANCELLED') DEFAULT 'PENDING',
    order_method ENUM('DINE_IN', 'TAKEAWAY') DEFAULT 'DINE_IN',
    reason VARCHAR(50),
    note VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES Tables(table_id)
) ENGINE=InnoDB;

-- 12. Order Details
CREATE TABLE Order_Details (
    order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (quantity * price) STORED,
    note VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (food_id) REFERENCES Foods(food_id)
) ENGINE=InnoDB;

