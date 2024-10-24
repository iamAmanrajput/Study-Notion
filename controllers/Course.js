const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
require("dotenv").config();
const {
  uploadImageCloudinary,
  uploadImageToCloudinary,
} = require("../utils/ImageUploader");

//create course handler function
exports.createCourse = async (req, res) => {
  try {
    //extract data from body
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    //get thumbnail
    const thumbnail = req.files.thumbnailImage;
    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are Required" });
    }
    //check for instructor
    //hame course me course ki instructor id store karni padti hai esliye hum db call maar rhe hai
    const userId = req.user.id; //esse pata chal jayega konsa current instructor course create kar rha hai
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details: ", instructorDetails);
    if (!instructorDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Instructor Details not found" });
    }
    //check given tag is valid or not
    const tagDetails = await Tag.findById(tag); //yaha pe tag ki id hogi bcz humne user model me reference store kiya hai
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag Details not found",
      });
    }
    //upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    //create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id, //bcz reference store kar rakha hai humne id ka
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });
    //add the new course to the user schema of Instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );
    //update the Tag Schema
    //return response
    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Create Course",
      error: error.message,
    });
  }
};

//getAllCourses handler function
exports.showAllCourses = async (req, res) => {
  try {
    //TODO : Change the below statement
    const allCourses = await Course.find({});

    return res.status(200).json({
      success: true,
      message: "Data For all Courses Fetched Successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot Fetch course data",
      error: error.message,
    });
  }
};
