//  import multer

const multer = require('multer')

// diskstorage

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads')
    },
    filename: (req, file, callback) => {
        const filename = `image-${Date.now()}-${file.originalname}`
        callback(null, filename)
    }
})

// filefilter

const fileFilter = (req, file, callback) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "video/mp4" || file.mimetype == "video/mkv" || file.mimetype == "video/webm") {
        callback(null, true)
    }
    else {
        callback(null, false)
        return callback(new Error, 'Only images (png, jpg, jpeg) and videos (mp4, mkv, webm) are allowed')
    }
}


const multerConfig = multer({
    storage,
    fileFilter,
    limits: { fileSize: 40 * 1024 * 1024 } // 40MB file limit
})

module.exports = multerConfig