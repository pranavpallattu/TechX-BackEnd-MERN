const courses = require("../Model/courseModel");
const lectures = require("../Model/lectureModel")
const coupons = require("../Model/couponModel")

// To add course

exports.addCourseController = async (req, res) => {
  console.log("inside add course controller");
  const { title, instructor, price, skill, duration, description } = req.body;

  const coverImage = req.files.coverImage[0].filename; // Save with "uploads/"
  console.log(coverImage);

  const introVideo = req.files.introVideo[0].filename;
  console.log(introVideo);

  try {
    const existingCourse = await courses.findOne({ title });
    if (existingCourse) {
      return res.status(406).json("Course already exists");
    }

    const newCourse = new courses({
      title,
      instructor,
      price,
      skill,
      duration,
      description,
      coverImage,
      introVideo,
    });

    await newCourse.save();
    res.status(200).json("Course successfully added");
  } catch (error) {
    res.status(400).json(`Course adding failed due to ${error}`);
  }
};


// To get all courses in adminpage

exports.getAdminCourseController = async (req, res) => {
  try {
    // Fetch all courses from the database
    const course = await courses.find(); // You can add a `select` to limit fields if necessary

    // Return the courses as JSON
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json(error);
  }
};


// To get all courses in user home page 

exports.getUserCoursesController = async (req, res) => {
  try {
    const userCourses = await courses.find()
    res.status(200).json(userCourses)
  }
  catch (error) {
    res.status(400).json(`user home page courses  ${error}`)
  }
}


// To get a specific course

exports.getSpecificCourseController = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await courses.findById(id); // Use findById directly
    res.status(200).json(course); // Send the course data in response
  } catch (error) {
    res.status(400).json(`Error fetching course: ${error}`);
  }
};


// To delete a course

exports.deleteCourseController = async (req, res) => {
  const { id } = req.params
  console.log(id);

  console.log(id);
  try {
    await coupons.deleteMany({ courseId: id })
    await lectures.deleteMany({ course: id })
    const response = await courses.findByIdAndDelete(id)
    res.status(200).json('deleted successfully')
  }
  catch (error) {
    res.status(400).json(error)
  }

}


// To edit course

exports.editCourseController = async (req, res) => {
  const { title, instructor, price, skill, duration, description, coverImage, introVideo } = req.body;

  const uploadImage = req.files ? req.files.coverImage?.[0]?.filename : coverImage

  const uploadVideo = req.files ? req.files.introVideo?.[0]?.filename : introVideo

  // ✅ Correctly extract courseId from req.params
  const { id: courseId } = req.params;
  console.log("Received Course ID:", courseId);

  try {
    const updatedCourse = await courses.findByIdAndUpdate(
      courseId,
      {
        title,
        instructor,
        price,
        skill,
        duration,
        description,
        coverImage: uploadImage,
        introVideo: uploadVideo,
      },
      { new: true }
    );

    await updatedCourse.save()
    res.status(200).json("Course updated successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json(`Course updation failed due to ${error.message}`);
  }
};
