const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req.body
    const { email } = req.body;
    //email validation
    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: "Please Enter Email" });
    }
    //check user for this email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }
    //generate token
    const token = crypto.randomUUID();
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );
    //create url
    const url = `http://localhost:3000/update-password/${token}`;
    //send mail containing the url
    await mailSender(
      email,
      "Password Reset Link",
      `password Reset Link: ${url}`
    );
    // return response
    return res.json({
      success: true,
      message:
        "Email Sent Successfully, Please check email and change your password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reset password",
    });
  }
};

//reset password

exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body; //yaha pe token ko frontend ne body me dala hai tabhi acces kar pa rehe hai
    //validation
    if (password !== confirmPassword) {
      return res.json({ success: false, message: "Password Not Matching" });
    }
    //get userDetails from db using token
    const userDetails = await User.findOne({ token: token });
    //if no entry - invalid token
    if (!userDetails) {
      return res.json({ success: false, message: "Token Invalid" });
    }
    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired, Please Regenerate Your Token",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //update password from db
    const updatedUser = await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    return res
      .status(200)
      .json({ succes: true, message: "password Reset Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while reset your password",
    });
  }
};
