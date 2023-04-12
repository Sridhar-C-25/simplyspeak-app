const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const apiStatus = require("../Enums/apiStatus");
const crypto = require("crypto-js");
const { VerficationHtml } = require("../utils/HtmlContent");
const { tranEmailApi, sender } = require("../utils/email");
const cookiekeys = require("../Enums/cookie");

async function sendVerificationMail(link, email) {
  const receivers = [
    {
      email,
    },
  ];
  try {
    const response = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Account Created Successfully",
      textContent: `
       Thank you.
       `,
      htmlContent: VerficationHtml(link),
      params: {
        role: "Frontend",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    return {
      message: "Email not send",
      status: apiStatus.failure,
    };
  }
}

const register = async (req, res, next) => {
  try {
    // Check if user exists
    const { email, password } = req.body;

    const hash = bcrypt.hashSync(password, 5);
    const vcode = crypto.lib.WordArray.random(6);

    const newUser = new User({
      ...req.body,
      password: hash,
      vcode,
    });

    await newUser.validate().then(
      () => null,
      (err) => {
        res.json({
          message: err.message.split(":")[2],
          status: apiStatus.failure,
        });
      }
    );

    const userExists = await User.findOne({ email });

    if (userExists) {
      if (
        bcrypt.compareSync(req.body.password, userExists.password) &&
        userExists.verify == false
      ) {
        const link =
          process.env.CLIENT_SIDE_HOST +
          "/verification/" +
          userExists._id +
          "/" +
          userExists.vcode;
        console.log(link);
        try {
          const email = await sendVerificationMail(link, req.body.email);
          return res.status(200).json({
            message: "Your Account Verification is pending!",
            status: apiStatus.success,
            email,
          });
        } catch (error) {
          return res.status(500).json(error);
        }
      } else {
        return res.status(200).json({
          message: "User already exists",
          status: apiStatus.failure,
        });
      }
    }

    const user = await newUser.save();
    const link =
      process.env.CLIENT_SIDE_HOST +
      "/verification/" +
      user._id +
      "/" +
      user.vcode;

    console.log(link);
    try {
      // const email = await sendVerificationMail(link, req.body.email);
      return res.status(200).json({
        message: `User as been created successfully, please check your ${req.body.email} account`,
        status: apiStatus.success,
        email,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const verifyAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user)
      return res.json({
        status: apiStatus.failure,
        message: "user not found!",
      });

    const match = user.vcode == req.body.vcode;

    if (!match) {
      return res.json({
        status: apiStatus.failure,
        message: "Verfication failed",
      });
    }
    if (user.verify) {
      return res.json({
        status: apiStatus.success,
        message: "Already Verified your account!",
      });
    }

    user.verify = true;
    await user.save();

    res.json({
      status: apiStatus.success,
      message: "Verfication Successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.json({
        message: "All fields are required",
        status: apiStatus.failure,
      });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.json({
        message: "User not found!",
        status: apiStatus.failure,
      });

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);

    if (!isCorrect)
      return res.json({
        message: "Wrong password or username!",
        status: apiStatus.failure,
      });

    if (user.verify != true) {
      return res.json({
        status: apiStatus.failure,
        message: "Pending Account. Please Verify Your Email!",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_KEY
    );
    const { password, ...info } = user._doc;
    res
      .cookie(cookiekeys.token, token, {
        httpOnly: false,
      })
      .send({
        message: "login successful!",
        status: apiStatus.success,
        data: info,
        token,
      });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    jwt.sign(token, "", { expiresIn: 1 }, (logout, err) => {
      if (logout) {
        res.clearCookie(cookiekeys.token);
        // Send a response to the client
        res.status(200).json({
          message: "Logout successful",
          status: apiStatus.success,
        });
      } else {
        res.send({ msg: "Error", status: apiStatus.success });
      }
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  register,
  verifyAccount,
  login,
  logout,
};
