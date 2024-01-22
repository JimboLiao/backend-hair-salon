const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../controllers/products");

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/search", searchProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
