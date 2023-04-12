const apiStatus = require("../Enums/apiStatus");
const {
  followUser,
  unfollowUser,
  getAllVerifyUsers,
  subscribeAuthor,
  unsubscribeAuthor,
} = require("../controllers/user.controller");
const verifyToken = require("../middleware/jwt");
const { User } = require("../models/user.model");

const router = require("express").Router();

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).send({
      status: apiStatus.success,
      message: "user found successfully",
      data: user,
    });
  } else {
    res.status(403).send({
      status: apiStatus.failure,
      message: "user notfound!",
    });
  }
});

router.get("/verified/all", getAllVerifyUsers);
router.post("/:id/follow", verifyToken, followUser);
router.post("/:id/unfollow", verifyToken, unfollowUser);
router.get("/subscribe/:authorId", verifyToken, subscribeAuthor);
router.get("/unsubscribe/:authorId", verifyToken, unsubscribeAuthor);

module.exports = router;
