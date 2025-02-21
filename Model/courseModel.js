const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
        unique: true
    },
    instructor: {
        required: true,
        type: String
    },
    price: {
        required: true,
        type: Number
    },
    skill: {
        required: true,
        type: String
    },
    duration: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    coverImage: {
        required: true,
        type: String
    },
    introVideo: {
        required: true,
        type: String
    },
    lectures: [{
        type: mongoose.Schema.Types.ObjectId, // Define it as an array of ObjectIds
        ref: 'lectures' // Reference the 'lectures' model
    }],
    enrolledUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
    ], // ✅ Ensure this exists
}, {
    timestamps: true
});

const courses = mongoose.model('courses', courseSchema);

module.exports = courses;
