const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // Import Cloudinary config

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "courses", // Cloudinary folder name
      resource_type: file.mimetype.startsWith("image/") ? "image" : "video", // Auto-detect file type
      allowed_formats: ["jpg", "png", "jpeg","webp", "mp4", "mkv", "webm"],
    };
  },
});

// Multer Configuration
const multerConfig = multer({
    storage,
    limits: { fileSize: 40 * 1024 * 1024 }, // 40MB max file size
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg","image/webp", "video/mp4", "video/mkv", "video/webm"];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type!"), false);
      }
    }
  });

module.exports = multerConfig;
