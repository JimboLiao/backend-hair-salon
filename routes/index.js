const express = require("express");
const { failResponse } = require("../utils/failResponse");
const router = express.Router();

router.use("/products", require("./products"));
router.use("/brands", require("./brands"));
router.use("/orders", require("./orders"));
router.use("/members", require("./members"));

router.use("/*", (req, res) => {
  return failResponse(res, 404, "Not Found Routes");
});

module.exports = router;
