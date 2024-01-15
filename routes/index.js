const express = require("express");
const router = express.Router();

router.use("/products", require("./products"));
router.use("/brands", require("./brands"));

router.use("/*", (req, res) => {
  res.status(404).send("Not Found");
});

module.exports = router;
