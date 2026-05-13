const express = require("express");
const router = express.Router();
const pool = require("../db");

function checkAdmin(req, res, next) {

  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  if (req.session.user.role !== "admin") {
    return res.redirect("/");
  }

  next();
}

router.get("/users", checkAdmin, async (req, res) => {

  const [users] = await pool.execute(`
    SELECT * FROM users
  `);

  res.render("admin/users", {
    users
  });

});

router.post("/users/:id/role", checkAdmin, async (req, res) => {

  const { role } = req.body;
  const { id } = req.params;

  await pool.execute(`
    UPDATE users
    SET role = ?
    WHERE id = ?
  `, [role, id]);

  res.redirect("/admin/users");

});

router.get("/products", checkAdmin, async (req, res) => {

  const [products] = await pool.execute(`
    SELECT products.*, users.full_name AS seller_name
    FROM products
    LEFT JOIN users
    ON products.seller_id = users.id
  `);

  res.render("admin/products", {
    products
  });

});

module.exports = router;