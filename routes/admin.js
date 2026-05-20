const express = require('express');
const router = express.Router();
const pool = require('../db');

function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  if (req.session.user.role !== 'admin') {
    return res.redirect('/');
  }

  next();
}

function getRoleId(role) {
  if (role === 'admin') return 3;
  if (role === 'seller') return 2;
  return 1;
}

/* =========================
   ADMIN - QUẢN LÝ TÀI KHOẢN
========================= */

// Trang quản lý tài khoản
router.get('/users', requireAdmin, async (req, res, next) => {
  try {
    const [users] = await pool.execute(`
      SELECT
        user_id,
        full_name,
        email,
        phone,
        address,
        role,
        role_id,
        is_active,
        created_at
      FROM users
      ORDER BY user_id DESC
    `);

    res.render('admin/users', { users });
  } catch (err) {
    next(err);
  }
});

// Đổi quyền tài khoản: user / seller / admin
router.post('/users/:id/role', requireAdmin, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const allowedRoles = ['user', 'seller', 'admin'];
    const newRole = allowedRoles.includes(role) ? role : 'user';
    const newRoleId = getRoleId(newRole);

    await pool.execute(
      `
      UPDATE users
      SET role = ?, role_id = ?, is_active = TRUE
      WHERE user_id = ?
      `,
      [newRole, newRoleId, userId]
    );

    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
});

// Xóa tài khoản
// Ở đây mình dùng xóa mềm: is_active = FALSE
// Vì nếu xóa cứng có thể làm mất dữ liệu đơn hàng, giỏ hàng.
router.post('/users/:id/delete', requireAdmin, async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Không cho admin tự xóa chính mình
    if (Number(userId) === Number(req.session.user.id)) {
      return res.redirect('/admin/users');
    }

    await pool.execute(
      `
      UPDATE users
      SET is_active = FALSE
      WHERE user_id = ?
      `,
      [userId]
    );

    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
});

// Khôi phục tài khoản
router.post('/users/:id/restore', requireAdmin, async (req, res, next) => {
  try {
    const userId = req.params.id;

    await pool.execute(
      `
      UPDATE users
      SET is_active = TRUE
      WHERE user_id = ?
      `,
      [userId]
    );

    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
});

/* =========================
   ADMIN - QUẢN LÝ SẢN PHẨM
========================= */

// Trang quản lý sản phẩm
router.get('/products', requireAdmin, async (req, res, next) => {
  try {
    const [products] = await pool.execute(`
      SELECT
        p.product_id,
        p.product_name,
        p.brand_id,
        p.category_id,
        p.description,
        p.specifications,
        p.image_url,
        p.is_promotion,
        p.is_active,
        p.seller_id,
        p.quantity,
        p.created_at,
        u.full_name AS seller_name
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.user_id
      ORDER BY p.product_id DESC
    `);

    res.render('admin/products', { products });
  } catch (err) {
    next(err);
  }
});

// Form thêm sản phẩm
router.get('/products/add', requireAdmin, async (req, res, next) => {
  try {
    const [sellers] = await pool.execute(`
      SELECT user_id, full_name, email
      FROM users
      WHERE role = 'seller' AND is_active = TRUE
      ORDER BY full_name ASC
    `);

    res.render('admin/add-product', {
      sellers,
      error: null
    });
  } catch (err) {
    next(err);
  }
});

// Xử lý thêm sản phẩm
router.post('/products/add', requireAdmin, async (req, res, next) => {
  try {
    const {
      product_name,
      brand_id,
      category_id,
      description,
      specifications,
      image_url,
      is_promotion,
      is_active,
      seller_id,
      quantity
    } = req.body;

    if (!product_name || !brand_id || !category_id) {
      const [sellers] = await pool.execute(`
        SELECT user_id, full_name, email
        FROM users
        WHERE role = 'seller' AND is_active = TRUE
        ORDER BY full_name ASC
      `);

      return res.render('admin/add-product', {
        sellers,
        error: 'Vui lòng nhập tên sản phẩm, brand_id và category_id'
      });
    }

    await pool.execute(
      `
      INSERT INTO products (
        product_name,
        brand_id,
        category_id,
        description,
        specifications,
        image_url,
        is_promotion,
        is_active,
        seller_id,
        quantity
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        product_name,
        Number(brand_id),
        Number(category_id),
        description || null,
        specifications || null,
        image_url || null,
        is_promotion ? 1 : 0,
        is_active ? 1 : 0,
        seller_id || null,
        Number(quantity || 0)
      ]
    );

    res.redirect('/admin/products');
  } catch (err) {
    next(err);
  }
});

// Form sửa sản phẩm
router.get('/products/:id/edit', requireAdmin, async (req, res, next) => {
  try {
    const productId = req.params.id;

    const [rows] = await pool.execute(
      `
      SELECT *
      FROM products
      WHERE product_id = ?
      `,
      [productId]
    );

    if (rows.length === 0) {
      return res.send('Không tìm thấy sản phẩm');
    }

    const [sellers] = await pool.execute(`
      SELECT user_id, full_name, email
      FROM users
      WHERE role = 'seller' AND is_active = TRUE
      ORDER BY full_name ASC
    `);

    res.render('admin/edit-product', {
      product: rows[0],
      sellers,
      error: null
    });
  } catch (err) {
    next(err);
  }
});

// Xử lý sửa sản phẩm
router.post('/products/:id/edit', requireAdmin, async (req, res, next) => {
  try {
    const productId = req.params.id;

    const {
      product_name,
      brand_id,
      category_id,
      description,
      specifications,
      image_url,
      is_promotion,
      is_active,
      seller_id,
      quantity
    } = req.body;

    if (!product_name || !brand_id || !category_id) {
      const [rows] = await pool.execute(
        'SELECT * FROM products WHERE product_id = ?',
        [productId]
      );

      const [sellers] = await pool.execute(`
        SELECT user_id, full_name, email
        FROM users
        WHERE role = 'seller' AND is_active = TRUE
        ORDER BY full_name ASC
      `);

      return res.render('admin/edit-product', {
        product: rows[0],
        sellers,
        error: 'Vui lòng nhập tên sản phẩm, brand_id và category_id'
      });
    }

    await pool.execute(
      `
      UPDATE products
      SET
        product_name = ?,
        brand_id = ?,
        category_id = ?,
        description = ?,
        specifications = ?,
        image_url = ?,
        is_promotion = ?,
        is_active = ?,
        seller_id = ?,
        quantity = ?
      WHERE product_id = ?
      `,
      [
        product_name,
        Number(brand_id),
        Number(category_id),
        description || null,
        specifications || null,
        image_url || null,
        is_promotion ? 1 : 0,
        is_active ? 1 : 0,
        seller_id || null,
        Number(quantity || 0),
        productId
      ]
    );

    res.redirect('/admin/products');
  } catch (err) {
    next(err);
  }
});

// Xóa sản phẩm
// Dùng xóa mềm: is_active = FALSE
router.post('/products/:id/delete', requireAdmin, async (req, res, next) => {
  try {
    const productId = req.params.id;

    await pool.execute(
      `
      UPDATE products
      SET is_active = FALSE
      WHERE product_id = ?
      `,
      [productId]
    );

    res.redirect('/admin/products');
  } catch (err) {
    next(err);
  }
});

// Khôi phục sản phẩm
router.post('/products/:id/restore', requireAdmin, async (req, res, next) => {
  try {
    const productId = req.params.id;

    await pool.execute(
      `
      UPDATE products
      SET is_active = TRUE
      WHERE product_id = ?
      `,
      [productId]
    );

    res.redirect('/admin/products');
  } catch (err) {
    next(err);
  }
});

module.exports = router;