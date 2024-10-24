const Tag = require("../models/Tags");

//create tag handler function
exports.createTag = async (req, res) => {
  try {
    //extract data from req.body
    const { name, description } = req.body;
    //validation
    if (!name || !description) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are required" });
    }
    //create entry in db
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);
    return res
      .status(200)
      .json({ success: true, message: "Tag Created Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//getallTags

exports.showAlltags = async (req, res) => {
  try {
    //getting all tags from db
    const allTags = await Tag.find({}, { name: true, description: true }); //ab esme wohi tags aayenge jisme name and description dono true hoga

    return res
      .status(200)
      .json({
        success: true,
        message: "All Tags return successfully",
        allTags,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
