CREATE DATABASE IF NOT EXISTS sports_shop1
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE sports_shop1;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS user_events;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  category VARCHAR(100),
  price DECIMAL(12,2) DEFAULT 0,
  rating FLOAT DEFAULT 0,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  event_type ENUM('view','cart','purchase') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE,

  FOREIGN KEY (product_id)
  REFERENCES products(id)
  ON DELETE CASCADE
);

CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY unique_cart (user_id, product_id),

  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE,

  FOREIGN KEY (product_id)
  REFERENCES products(id)
  ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE CASCADE
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  price DECIMAL(12,2) DEFAULT 0,

  FOREIGN KEY (order_id)
  REFERENCES orders(id)
  ON DELETE CASCADE,

  FOREIGN KEY (product_id)
  REFERENCES products(id)
  ON DELETE CASCADE
);

USE sports_shop1;

INSERT INTO products
(product_name, brand, category, price, rating, description, image_url)
VALUES

('Nike Air Zoom Pegasus 40',
'Nike',
'Giày chạy bộ',
3200000,
4.8,
'Giày chạy bộ Nike Air Zoom Pegasus 40 phù hợp chạy bộ hằng ngày.',
'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'),

('Adidas Ultraboost Light',
'Adidas',
'Giày chạy bộ',
4500000,
4.9,
'Giày chạy bộ Adidas Ultraboost Light êm và nhẹ.',
'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600'),

('Asics Gel Kayano 30',
'Asics',
'Giày chạy bộ',
4100000,
4.7,
'Giày chạy bộ Asics Gel Kayano 30 hỗ trợ bàn chân tốt.',
'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600'),

('Puma Velocity Nitro 2',
'Puma',
'Giày chạy bộ',
2600000,
4.5,
'Giày chạy bộ Puma Velocity Nitro 2 dành cho luyện tập.',
'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=600'),

('Nike Revolution 7',
'Nike',
'Giày chạy bộ',
2100000,
4.4,
'Giày chạy bộ Nike Revolution 7.',
'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600'),

('Adidas Duramo SL',
'Adidas',
'Giày chạy bộ',
1800000,
4.3,
'Giày chạy bộ Adidas Duramo SL.',
'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600'),

('Nike Mercurial Vapor 15',
'Nike',
'Bóng đá',
3500000,
4.8,
'Giày đá bóng Nike Mercurial Vapor 15 sân cỏ tự nhiên.',
'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600'),

('Adidas Predator Accuracy',
'Adidas',
'Bóng đá',
3900000,
4.7,
'Giày đá bóng Adidas Predator Accuracy hỗ trợ kiểm soát bóng.',
'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600'),

('Puma Future Ultimate FG',
'Puma',
'Bóng đá',
3200000,
4.6,
'Giày bóng đá Puma Future Ultimate FG.',
'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600'),

('Quả bóng Adidas UCL League',
'Adidas',
'Bóng đá',
950000,
4.5,
'Bóng đá Adidas UCL League dùng cho tập luyện.',
'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600'),

('Quả bóng Nike Strike',
'Nike',
'Bóng đá',
850000,
4.4,
'Bóng đá Nike Strike.',
'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=600'),

('Áo bóng đá Manchester United',
'Adidas',
'Bóng đá',
1900000,
4.7,
'Áo đấu Manchester United mùa giải mới.',
'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600'),

('Yonex Astrox 100ZZ',
'Yonex',
'Cầu lông',
5200000,
4.9,
'Vợt cầu lông Yonex Astrox 100ZZ cao cấp.',
'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600'),

('Yonex Nanoflare 800',
'Yonex',
'Cầu lông',
4200000,
4.7,
'Vợt cầu lông Yonex Nanoflare 800 tốc độ cao.',
'https://images.unsplash.com/photo-1613918431703-aa50889e3be9?w=600'),

('Li-Ning Aeronaut 9000C',
'Li-Ning',
'Cầu lông',
3600000,
4.6,
'Vợt cầu lông Li-Ning Aeronaut 9000C.',
'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600'),

('Giày cầu lông Yonex Power Cushion',
'Yonex',
'Cầu lông',
2100000,
4.5,
'Giày cầu lông Yonex Power Cushion bám sân tốt.',
'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600'),

('Ống cầu lông Yonex AS50',
'Yonex',
'Cầu lông',
950000,
4.6,
'Ống cầu lông Yonex AS50 tốc độ chuẩn.',
'https://images.unsplash.com/photo-1593766827228-8737b4534aa6?w=600'),

('Wilson Evolution Basketball',
'Wilson',
'Bóng rổ',
1850000,
4.8,
'Bóng rổ Wilson Evolution dùng trong thi đấu và tập luyện.',
'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600'),

('Nike Basketball Shoes',
'Nike',
'Bóng rổ',
3300000,
4.7,
'Giày bóng rổ Nike hỗ trợ cổ chân.',
'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600'),

('Spalding NBA Basketball',
'Spalding',
'Bóng rổ',
1200000,
4.5,
'Bóng rổ Spalding NBA size 7.',
'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=600'),

('Áo bóng rổ Lakers',
'Nike',
'Bóng rổ',
1500000,
4.5,
'Áo đấu bóng rổ Lakers.',
'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600'),

('Nike Dri-FIT Training Shirt',
'Nike',
'Gym',
850000,
4.5,
'Áo tập gym Nike Dri-FIT thoáng khí.',
'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'),

('Adidas Training Shorts',
'Adidas',
'Gym',
790000,
4.4,
'Quần tập Adidas co giãn tốt.',
'https://images.unsplash.com/photo-1506629905607-d8f768aa5bbb?w=600'),

('Under Armour Compression Shirt',
'Under Armour',
'Gym',
950000,
4.6,
'Áo nén cơ Under Armour dành cho tập luyện.',
'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600'),

('Dây kháng lực tập gym',
'MDBuddy',
'Gym',
250000,
4.3,
'Dây kháng lực hỗ trợ tập tay, chân, vai.',
'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600'),

('Thảm tập yoga Adidas',
'Adidas',
'Yoga',
690000,
4.6,
'Thảm yoga chống trượt, dễ vệ sinh.',
'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600'),

('Mikasa V200W Volleyball',
'Mikasa',
'Bóng chuyền',
1450000,
4.7,
'Bóng chuyền Mikasa V200W tiêu chuẩn thi đấu.',
'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600'),

('Molten Volleyball',
'Molten',
'Bóng chuyền',
950000,
4.5,
'Bóng chuyền Molten dùng cho tập luyện.',
'https://images.unsplash.com/photo-1588492069485-d05b56b2831d?w=600'),

('Mũ bơi Speedo',
'Speedo',
'Bơi lội',
350000,
4.4,
'Mũ bơi Speedo chất liệu silicone.',
'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600'),

('Kính bơi Arena',
'Arena',
'Bơi lội',
650000,
4.5,
'Kính bơi Arena chống mờ, chống tia UV.',
'https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?w=600'),

('Quần bơi Speedo',
'Speedo',
'Bơi lội',
780000,
4.4,
'Quần bơi Speedo dành cho luyện tập.',
'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600');
USE sports_shop1;
SET SQL_SAFE_UPDATES = 0;
