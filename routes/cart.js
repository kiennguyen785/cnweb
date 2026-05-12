const express = require('express');
const router = express.Router();
const pool = require('../db');

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  next();
}

router.get('/', requireLogin, async (req, res) => {
  const [items] = await pool.execute(
    `
    SELECT
      c.id,
      c.user_id,
      c.product_id,
      c.quantity,
      p.product_name,
      p.price,
      p.image_url
    FROM cart_items c
    JOIN products p
    ON c.product_id = p.id
    WHERE c.user_id = ?
    `,
    [req.session.user.id]
  );

  let total = 0;

  items.forEach(item => {
    total += Number(item.price) * Number(item.quantity);
  });

  res.render('cart', {
    items,
    total
  });
});

router.post('/add/:id', requireLogin, async (req, res) => {
  const productId = req.params.id;

  await pool.execute(
    `
    INSERT INTO cart_items(user_id, product_id, quantity)
    VALUES (?, ?, 1)
    ON DUPLICATE KEY UPDATE quantity = quantity + 1
    `,
    [
      req.session.user.id,
      productId
    ]
  );

  await pool.execute(
    `
    INSERT INTO user_events(user_id, product_id, event_type)
    VALUES (?, ?, ?)
    `,
    [
      req.session.user.id,
      productId,
      'cart'
    ]
  );

  res.redirect('/cart');
});

router.post('/api/increase/:productId', requireLogin, async (req, res) => {
  await pool.execute(
    `
    UPDATE cart_items
    SET quantity = quantity + 1
    WHERE user_id = ?
    AND product_id = ?
    `,
    [
      req.session.user.id,
      req.params.productId
    ]
  );

  const [rows] = await pool.execute(
    `
    SELECT quantity
    FROM cart_items
    WHERE user_id = ?
    AND product_id = ?
    `,
    [
      req.session.user.id,
      req.params.productId
    ]
  );

  res.json({
    success: true,
    quantity: rows[0].quantity
  });
});

router.post('/api/decrease/:productId', requireLogin, async (req, res) => {
  await pool.execute(
    `
    UPDATE cart_items
    SET quantity = quantity - 1
    WHERE user_id = ?
    AND product_id = ?
    AND quantity > 1
    `,
    [
      req.session.user.id,
      req.params.productId
    ]
  );

  const [rows] = await pool.execute(
    `
    SELECT quantity
    FROM cart_items
    WHERE user_id = ?
    AND product_id = ?
    `,
    [
      req.session.user.id,
      req.params.productId
    ]
  );

  res.json({
    success: true,
    quantity: rows[0].quantity
  });
});

router.post('/remove/:id', requireLogin, async (req, res) => {
  await pool.execute(
    `
    DELETE FROM cart_items
    WHERE id = ?
    AND user_id = ?
    `,
    [
      req.params.id,
      req.session.user.id
    ]
  );

  res.redirect('/cart');
});

module.exports = router;