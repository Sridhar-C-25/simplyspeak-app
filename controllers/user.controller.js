const apiStatus = require("../Enums/apiStatus");
const { User } = require("../models/user.model");
const ImageUpload = require("../utils/imageUpload");

// * Get All "Account Verified" Users in DB
const getAllVerifyUsers = async (req, res, next) => {
  try {
    const users = await User.find({ verify: true });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const followUser = async (req, res, next) => {
  try {
    const user1 = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { followers: req.userId } },
      { new: true }
    );
    const user2 = await User.findByIdAndUpdate(
      req.userId,
      {
        $addToSet: { following: req.params.id },
      },
      { new: true }
    );
    return res.status(200).json({
      user1,
      user2,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const user1 = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { followers: req.userId } },
      { new: true }
    );
    const user2 = await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: { following: req.params.id },
      },
      { new: true }
    );
    return res.status(200).json({
      user1,
      user2,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const subscribeAuthor = async (req, res, next) => {
  try {
    const authorId = req.params.authorId;
    const userId = req.userId;

    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    await User.findByIdAndUpdate(
      authorId,
      { $addToSet: { emailSubscription: userId } },
      { new: true }
    );

    return res.status(200).json({
      status: apiStatus.success,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const unsubscribeAuthor = async (req, res, next) => {
  try {
    const authorId = req.params.authorId;
    const userId = req.userId;

    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    await User.findByIdAndUpdate(
      authorId,
      { $pull: { emailSubscription: userId } },
      { new: true }
    );

    return res.status(200).json({
      status: apiStatus.success,
      message: "Unsubscribed successfully",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getAllVerifyUsers,
  subscribeAuthor,
  unsubscribeAuthor,
};
