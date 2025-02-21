const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: true
  },

  paymentId: {
    type: String,
    required: true
  },

  orderId: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  },

  status: {
    type: String,
    enum: ["Success", "Failed"],
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const payments = mongoose.model("payments", paymentSchema);

module.exports = payments