const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    totalPaid: {
      type: Number,
      default: 0
    }, 
    enrolledCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'courses'
    }], 
  },
  {
    timestamps: true, 
  }
);

const users = mongoose.model('users', userSchema);

module.exports = users;
