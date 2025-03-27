const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const createFolderCloudinary = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
      transformation: [{ fetch_format: "webp", quality: "auto:good" }],
    },
  });

  return storage;
};

module.exports = { createFolderCloudinary };
