const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {

  const { email, password } = req.body;

  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (rows.length === 0) {
    return res.render('login', {
      error: 'Email không tồn tại'
    });
  }

  const user = rows[0];

  const ok = await bcrypt.compare(
    password,
    user.password
  );

  if (!ok) {
    return res.render('login', {
      error: 'Sai mật khẩu'
    });
  }

  req.session.user = {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role
  };
  res.redirect('/');
});

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  const { full_name, email, password, role } = req.body;

  const [exists] = await pool.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (exists.length > 0) {
    return res.render('register', {
      error: 'Email đã được đăng ký'
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const accountRole = role === 'seller' ? 'seller' : 'user';

  await pool.execute(
    'INSERT INTO users(full_name, email, password, role) VALUES (?, ?, ?, ?)',
    [full_name, email, hash, accountRole]
  );

  res.redirect('/auth/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;