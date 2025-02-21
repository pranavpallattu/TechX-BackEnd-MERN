// import model
const users = require('../Model/userModel')
const courses = require('../Model/courseModel')

// import jwt
const jwt = require('jsonwebtoken')
// import bcrypt
const bcrypt = require('bcrypt')

// To register

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body
    console.log(username, email, password, role);
    console.log('inside register function');
    try {
        const existingUsers = await users.findOne({ email })
        if (existingUsers) {
            res.status(400).json('user already exists')
        }
        else {
            const encryptedPassword = await bcrypt.hash(password, 10)
            const newUser = new users({
                username,
                email,
                password: encryptedPassword,
                // role
            })
            await newUser.save()
            res.status(200).json(newUser)
        }

    }
    catch (error) {
        res.status(400).json(error)
    }
}

// For admin and user login

exports.login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if the user exists
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        // Validate role BEFORE password check
        if (existingUser.role !== role) {
            return res.status(403).json({ message: "Unauthorized role" });
        }
        // password validation

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }


        // Generate JWT token
        const token = jwt.sign({ userId: existingUser._id }, "secretkey")
        res.status(200).json({ existingUser, token })

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An error occurred during login", error });
    }
};


// To get userData

exports.getUserDataController = async (req, res) => {
    const { id } = req.params
    try {
        const user = await users.findOne({ _id: id })
        res.status(200).json(user)
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}

// To get All users Data

exports.getAllUsersDataController = async (req, res) => {
    try {
        const response = await users.find({ role: { $ne: 'admin' } }) // Exclude admins
            .populate("enrolledCourses", "title");

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
};


// To Delete a user

exports.deleteUserController = async (req, res) => {
    const { id } = req.params
    try {
        await courses.updateMany(
            { enrolledUsers: id },
            { $pull: { enrolledUsers: id } }
        );
        const response = await users.findByIdAndDelete(id)
        res.status(200).json(response)
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
}