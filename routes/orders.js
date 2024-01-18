const express = require("express");
const {
  getOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orders");
const { authJwt } = require("../controllers/auth");
const router = express.Router();

router.get("/", [authJwt, getOrders]);
router.post("/", [authJwt, createOrder]);
router.get("/:id", [authJwt, getOrder]);
router.put("/:id", [authJwt, updateOrder]);
router.delete("/:id", [authJwt, deleteOrder]);
module.exports = router;
