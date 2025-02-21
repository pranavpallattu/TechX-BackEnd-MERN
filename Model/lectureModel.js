// import mongoose

const mongoose = require('mongoose')

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lectureVideo: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const lectures = mongoose.model("lectures", lectureSchema)

module.exports = lectures;