const express = require("express");
const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
} = require("../controllers/brands");
const router = express.Router();

router.get("/", getBrands);
router.post("/", createBrand);
router.get("/:id", getBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);
module.exports = router;
