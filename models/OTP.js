const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

// hume schema ke baad model se pehle code ko likhna hai bcz database me entry se pehle verify karwa sake
//a function -> to send emails
async function sendVerificationEmail(email, otp) {
  //kisko mail karna , kis otp ke sath karna hai
  try {
    const mailResponse = await mailSender(
      email,
      "verification Email from StudyNotion",
      otp
    );
    console.log("Email Sent Successfully", mailResponse);
  } catch (error) {
    console.log("error occured while sending mails : ", error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp); //bcz hum otpschema object ke ander hai or waha pe varibale ko this ki help se access karenge
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
