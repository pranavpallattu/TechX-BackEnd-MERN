const courses = require('../Model/courseModel')
const coupons = require('../Model/couponModel')

// To create coupon

exports.createCouponController = async (req, res) => {
    try {
        const { code, courseId, discountAmount, expiryDate } = req.body


        // chech if the course exists
        const existingCourse = await courses.findById(courseId)
        if (!existingCourse) {
            return res.status(406).json('course not found')
        }

        const existingCoupon = await coupons.findOne({ code })
        if (existingCoupon) {
            return res.status(406).json('coupon already exists')
        }

        const newCoupon = new coupons({
            code,
            courseId,
            discountAmount,
            expiryDate,
        })
        await newCoupon.save()
        return res.status(200).json('coupon create successfully')
        // if(existingCoup)
    }
    catch (error) {
        return res.status(500).json(error)

    }
}

// To get all coupons

exports.getCouponController = async (req, res) => {
    try {
        const coupon = await coupons.find().populate("courseId", "title");
        res.status(200).json(coupon);
    }
    catch (error) {
        res.status(500).json(error)
        console.log(error);

    }
}

// To apply coupon

exports.applyCouponController = async (req, res) => {
    try {
        const { courseId, couponCode } = req.body
        // check if course exists
        const course = await courses.findById(courseId)
        if (!course) {
            return res.status(402).json('course not found')
        }

        // check if coupon exists

        const coupon = await coupons.findOne({ code: couponCode })
        if (!coupon) {
            return res.status(401).json('coupon not valid')

        }

        // chech coupon date

        const currentDate = new Date()
        if (coupon.expiryDate < currentDate) {
            return res.status(406).json('coupon has expired')
        }

        // chech if the copon is valid for the course

        if (coupon.courseId.toString() !== course._id.toString()) {
            return res.status(408).json('coupon is not valid for this course')
        }

        const discountedPrice = Math.max(course.price - coupon.discountAmount, 0)

        return res.status(200).json({
            message: "coupon applied successfully",
            originalPrice: course.price,
            discountAmount: coupon.discountAmount,
            finalAmount: discountedPrice
        })


    }
    catch (error) {
        return res.status(500).json(error)
        console.log(error);

    }
}


// To delete coupon

exports.deleteCouponController = async (req, res) => {
    try {
        const { id } = req.params
        const result = await coupons.findByIdAndDelete(id)
        res.status(200).json('coupon removed successfully')
    }
    catch (error) {
        res.status(500).json(error)
        console.log(error);

    }
}

// To get Coupons for the specific course

exports.getCouponsForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const couponsForCourse = await coupons.find({ courseId });
        return res.status(200).json(couponsForCourse);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


// To edit coupon

exports.editCouponController = async (req, res) => {
    try {
        const { code, discountAmount, expiryDate, courseId } = req.body;
        const { id } = req.params;

        if (!code || !discountAmount || !expiryDate || !courseId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const updatedCoupon = await coupons.findByIdAndUpdate(
            id,
            { code, discountAmount, expiryDate, courseId },
            { new: true }
        ).populate("courseId", "title");  // ✅ Populate course title again

        if (!updatedCoupon) {
            return res.status(404).json({ error: "Coupon not found" });
        }

        res.status(200).json({ message: "Coupon updated successfully", updatedCoupon });
    } catch (error) {
        console.error("Error updating coupon:", error);
        res.status(500).json({ error: "Server error" });
    }
};

