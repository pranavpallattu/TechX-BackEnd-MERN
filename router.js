// import express
const express = require('express')

// import usercontroller
const usercontroller = require('./controller/userController')

// import projectController
const coursecontroller = require('./controller/courseController')

// import lecturecontroller
const lectureController = require('./controller/lectureController')

// import paymentcontroller
const paymentcontroller = require('./controller/paymentController')

// import couponController
const couponController = require('./controller/couponController')

// import jwtmiddleware
const jwtMiddleware = require('./middleware/jwtMiddleware')

// import multer
const multerConfig = require('./middleware/multerMiddleware')

// instance router
const router = new express.Router()

// register
router.post('/register', usercontroller.register)

// login
router.post('/login', usercontroller.login)

// add course
router.post('/add-course', jwtMiddleware, multerConfig.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'introVideo', maxCount: 1 } // Only 1 intro video
]), coursecontroller.addCourseController);


// To get all courses in adminpage
router.get('/get-courses', jwtMiddleware, coursecontroller.getAdminCourseController);

// To add lecture to a course
router.post('/addlectures/:id', jwtMiddleware, multerConfig.single('lectureVideo'), lectureController.addLectureController)

// To get lectures in both admin and user side
router.get('/getlectures/:id', jwtMiddleware, lectureController.getLecture)

// To get all courses in user home page 
router.get('/availablecourses', coursecontroller.getUserCoursesController)

// To get a specific course
router.get('/availablecourses/:id', coursecontroller.getSpecificCourseController)

//To Create Razorpay Order
router.post('/payment/create-order', jwtMiddleware, paymentcontroller.createOrder);

// To verify payment
router.post('/payment/verify', jwtMiddleware, paymentcontroller.verifyPaymentController);

// To store payment
router.post('/payment/store', jwtMiddleware, paymentcontroller.storePaymentController);  

// To  Fetch purchased courses for a specific user
router.get("/user/purchased-courses", jwtMiddleware, paymentcontroller.getPurchasedCourses);

// To delete a course
router.delete('/course/remove/:id', jwtMiddleware, coursecontroller.deleteCourseController)

// Create a coupon
router.post('/coupon/create', jwtMiddleware, couponController.createCouponController);

// Get all coupons
router.get('/coupons', jwtMiddleware, couponController.getCouponController);

// Apply a coupon to a course
router.post('/coupons/apply', jwtMiddleware, couponController.applyCouponController);

// Delete a coupon
router.delete('/coupon/remove/:id', jwtMiddleware, couponController.deleteCouponController);

// Get coupons for a specific course
router.get('/coupons/:courseId', jwtMiddleware, couponController.getCouponsForCourse); 

// get user data
router.get('/user/data/:id', jwtMiddleware, usercontroller.getUserDataController)

// edit coupon
router.put('/coupon/edit/:id', jwtMiddleware, couponController.editCouponController)

// update course
router.put('/course/update/:id', jwtMiddleware, multerConfig.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'introVideo', maxCount: 1 }
]), coursecontroller.editCourseController)

// delete lecture
router.delete('/lecture/delete/:id', jwtMiddleware, lectureController.deleteLectureController)

// get all users data
router.get('/allusers', jwtMiddleware, usercontroller.getAllUsersDataController)

// delete user
router.delete('/user/delete/:id', jwtMiddleware, usercontroller.deleteUserController)

module.exports = router


