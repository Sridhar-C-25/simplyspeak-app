const {
  login,
  register,
  verifyAccount,
  logout,
} = require("../controllers/auth.controller");
const verifyToken = require("../middleware/jwt");

const router = require("express").Router();

router.post("/login", login);
router.put("/logout", verifyToken, logout);
router.post("/signup", register);
router.post("/verifyaccount", verifyAccount);

module.exports = router;
