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

// Trang quản lý tài khoản
router.get('/users', requireAdmin, async (req, res) => {
  const [users] = await pool.execute(`
    SELECT id, full_name, email, phone, address, role, created_at
    FROM users
    ORDER BY id DESC
  `);

  res.render('admin/users', {
    users
  });
});

// Đổi quyền tài khoản
router.post('/users/:id/role', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const newRole = ['user', 'seller', 'admin'].includes(role)
    ? role
    : 'user';

  await pool.execute(
    'UPDATE users SET role = ? WHERE id = ?',
    [newRole, id]
  );

  res.redirect('/admin/users');
});

// Xóa tài khoản
router.post('/users/:id/delete', requireAdmin, async (req, res) => {
  const { id } = req.params;

  await pool.execute(
    'DELETE FROM users WHERE id = ?',
    [id]
  );

  res.redirect('/admin/users');
});
// Trang quản lý sản phẩm
router.get('/products', requireAdmin, async (req, res) => {

  const [products] = await pool.execute(`
    SELECT *
    FROM products
    ORDER BY id DESC
  `);

  res.render('admin/products', {
    products
  });

});

// Xóa sản phẩm
router.post('/products/:id/delete', requireAdmin, async (req, res) => {

  const { id } = req.params;

  await pool.execute(
    'DELETE FROM products WHERE id = ?',
    [id]
  );

  res.redirect('/admin/products');

});
// Form thêm sản phẩm
router.get('/products/add', requireAdmin, (req, res) => {

  res.render('admin/add-product');

});

// Xử lý thêm sản phẩm
router.post('/products/add', requireAdmin, async (req, res) => {
    const {
        product_name,
        category,
        price,
        quantity,
        image_url,
        seller_id
    } = req.body;

  await pool.execute(`
    INSERT INTO products(
        product_name,
        category,
        price,
        quantity,
        image_url,
        seller_id
        )
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
  product_name,
    category,
    price,
    quantity,
    image_url,
    seller_id || null
]);

  res.redirect('/admin/products');

});
module.exports = router;