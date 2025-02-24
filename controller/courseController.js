const courses = require("../Model/courseModel");
const lectures = require("../Model/lectureModel")
const coupons = require("../Model/couponModel")
const cloudinary = require("../config/cloudinary"); // Import Cloudinary configuration


// To add course


exports.addCourseController = async (req, res) => {
  try {
    console.log("Inside add course controller");

    const { title, instructor, price, skill, duration, description } = req.body;
    console.log(req.body);
    console.log(req.files);

    // Check if course already exists
    const existingCourse = await courses.findOne({ title });
    if (existingCourse) {
      return res.status(406).json("Course already exists");
    }

    // Save the Cloudinary URLs directly from req.files
    const newCourse = new courses({
      title,
      instructor,
      price,
      skill,
      duration,
      description,
      coverImage: req.files.coverImage[0].path, // Direct Cloudinary URL
      introVideo: req.files.introVideo[0].path, // Direct Cloudinary URL
    });

    await newCourse.save();
    res.status(200).json({ message: "Course successfully added", course: newCourse });
  } catch (error) {
    res.status(400).json({ error: `Course adding failed due to ${error.message}` });
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
  console.log("Inside editCourseController");

  const { title, instructor, price, skill, duration, description } = req.body;
  console.log("Received Request Body:", req.body);
  console.log("Received Files:", req.files);

  // ✅ Extract courseId from params
  const { id: courseId } = req.params;
  console.log("Received Course ID:", courseId);

  try {
    // ✅ Fetch the existing course
    const existingCourse = await courses.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // ✅ Use new uploaded file paths (if provided) from Multer-Cloudinary, otherwise keep existing paths
    const coverImagePath = req.files && req.files.coverImage 
      ? req.files.coverImage[0].path  // ✅ Directly use Multer-Cloudinary URL
      : existingCourse.coverImage;

    const introVideoPath = req.files && req.files.introVideo 
      ? req.files.introVideo[0].path  // ✅ Directly use Multer-Cloudinary URL
      : existingCourse.introVideo;

    console.log("Updated Cover Image Path:", coverImagePath);
    console.log("Updated Intro Video Path:", introVideoPath);

    // ✅ Update course with new data
    const updatedCourse = await courses.findByIdAndUpdate(
      courseId,
      {
        title,
        instructor,
        price,
        skill,
        duration,
        description,
        coverImage: coverImagePath,
        introVideo: introVideoPath,
      },
      { new: true }
    );

    console.log("Updated Course:", updatedCourse);

    res.status(200).json({ success: true, message: "Course updated successfully", updatedCourse });
  } catch (error) {
    console.error("Error during course update:", error);
    res.status(500).json({ success: false, error: `Course update failed due to ${error.message}` });
  }
};
