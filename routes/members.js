const express = require("express");
const {
  createMember,
  loginMember,
  getMember,
  updateMember,
} = require("../controllers/members");
const { authJwt } = require("../controllers/auth");
const router = express.Router();

router.post("/signup", createMember);
router.post("/login", loginMember);
router.get("/:id/profile", [authJwt, getMember]);
router.put("/:id", [authJwt, updateMember]);

module.exports = router;
