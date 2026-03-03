const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: "voyagr_DEV",
  allowedFormats: ["jpeg", "png", "jpg"],
});

module.exports = { cloudinary: cloudinary.v2, storage };
