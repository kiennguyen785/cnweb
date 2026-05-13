const express = require("express");
const router = express.Router();
const pool = require("../db");

function checkSeller(req, res, next) {

  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  if (req.session.user.role !== "seller") {
    return res.redirect("/");
  }

  next();
}

router.get("/products", checkSeller, async (req, res) => {

  const [products] = await pool.execute(`
    SELECT *
    FROM products
    WHERE seller_id = ?
  `, [req.session.user.id]);

  res.render("seller/products", {
    products
  });

});

module.exports = router;