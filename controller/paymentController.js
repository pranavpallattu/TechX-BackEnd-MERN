const Razorpay = require('razorpay');
const crypto = require("crypto");
const Payment = require("../Model/paymentModel");
const Course = require("../Model/courseModel")
const User = require("../Model/userModel")
const razorpayInstance = require('../controller/razorpay.js')

//To Create Razorpay Order

exports.createOrder = async (req, res) => {
    try {
        const { amount, currency, courseId } = req.body;
        const userId = req.user.id;  // Ensure user is authenticated

        // ✅ Check if the user already purchased the course
        const existingPayment = await Payment.findOne({ userId, courseId });
        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: "You have already purchased this course.",
            });
        }

        // ✅ If not purchased, proceed with order creation
        const options = {
            amount: amount * 100, // Convert amount to paise
            currency: currency || "INR",
            receipt: `receipt_${courseId.substring(0, 10)}_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({
            success: false,
            message: "Error creating Razorpay order",
            error: error.message,
        });
    }
};


// To verify payment

exports.verifyPaymentController = async (req, res) => {
    try {
        const { paymentId, orderId, signature } = req.body;
        const userId = req.user.userId;
        // Verify signature
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${orderId}|${paymentId}`);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature !== signature) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        res.json({ success: true, message: "Payment verified successfully" });

    } catch (error) {
        console.error("Payment verification failed:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


// To store payment

exports.storePaymentController = async (req, res) => {
    try {
        const { paymentId, orderId, courseId, amount, currency } = req.body;
        const userId = req.user.userId;

        // ✅ Check if payment already exists (avoid duplicates)
        const existingPayment = await Payment.findOne({ userId, courseId });
        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: "This course has already been purchased.",
            });
        }

        // ✅ Store payment only if it's a new purchase
        const newPayment = new Payment({
            userId,
            courseId,
            paymentId,
            orderId,
            amount,
            currency: currency || "INR",
            status: "Success",
        });

        await newPayment.save();

        // ✅ Update the `users` collection (enrolledCourses)
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { enrolledCourses: courseId } }, // Prevents duplicates
            { new: true }
        );

        await User.findByIdAndUpdate(userId, { $inc: { totalPaid: amount } })

        // ✅ Update the `courses` collection (enrolledUsers)
        await Course.findByIdAndUpdate(
            courseId,
            { $addToSet: { enrolledUsers: userId } }, // Prevents duplicates
            { new: true }
        );

        res.json({ success: true, message: "Payment stored successfully & Enrollment updated." });

    } catch (error) {
        console.error("Error storing payment:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};






// To  Fetch purchased courses for a specific user

exports.getPurchasedCourses = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log("User ID:", userId); // ✅ Debugging log

        // 🔍 Find purchased courses for this user
        const purchasedCourses = await Payment.find({ userId }).select("courseId");
        console.log("Purchased Courses (IDs):", purchasedCourses); // ✅ Debugging log

        const courseIds = purchasedCourses.map(payment => payment.courseId);
        console.log("Extracted Course IDs:", courseIds); // ✅ Debugging log

        // Fetch course details
        const courses = await Course.find({ _id: { $in: courseIds } });
        console.log("Final Courses Data:", courses); // ✅ Debugging log

        res.json({ success: true, courses });
    } catch (error) {
        console.error("Error fetching purchased courses:", error);
        res.status(500).json({ success: false, message: "Error fetching purchased courses" });
    }
};
