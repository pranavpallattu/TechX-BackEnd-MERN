const courses = require("../Model/courseModel");
const lectures = require("../Model/lectureModel");
const path = require("path");

// To add lecture to a course
exports.addLectureController = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { title, description } = req.body;

    console.log(req.file); // Debugging: Check what req.file contains

    // Validate input
    if (!title || !description || !req.file) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate course existence
    const course = await courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Create and save lecture
    const lecture = new lectures({
      title,
      description,
      lectureVideo: req.file.path, // Directly use Cloudinary URL
      course: courseId,
    });
    

    await lecture.save();
    console.log(lecture);
    

    // Add lecture to course
    course.lectures.push(lecture._id);
    await course.save();

    res.status(201).json({ message: "Lecture added successfully.", lecture });
  } catch (error) {
    console.error("Error adding lecture:", error);
    res.status(500).json({ message: "Server error. Unable to add lecture.", error });
  }
};

// To get lectures in both admin and user side

exports.getLecture = async (req, res) => {
  try {
    const { id: courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    const course = await courses.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json({ message: "Lectures and Course fetched successfully.", lectures: course.lectures, course });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


// To delete a lecture

exports.deleteLectureController = async (req, res) => {
  const { id } = req.params; // Get lecture ID
  console.log(id);

  try {
    // Find and delete the lecture
    const deleteLecture = await lectures.findByIdAndDelete(id);

    if (!deleteLecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // Remove the lecture from all courses that contain it
    await courses.updateMany(
      { lectures: id }, // Find courses containing the lecture
      { $pull: { lectures: id } } // Remove lecture ID from array
    );

    res.status(200).json({ message: "Lecture deleted successfully", deleteLecture });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lecture", error });
  }
};