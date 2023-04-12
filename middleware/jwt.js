const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const apiStatus = require("../Enums/apiStatus");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).send({
      message: "You are not authenticated!",
      status: 0,
    });

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) {
      return res.status(403).send({
        message: "Token is not valid!",
        status: 0,
      });
    }

    const userId = payload.id;
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(401).send({
          message: "You are not authorized!",
          status: apiStatus.failure,
        });
      }
      req.userId = userId;
      next();
    } catch (err) {
      console.log(err);
      next(err);
    }
  });
};

module.exports = verifyToken;
