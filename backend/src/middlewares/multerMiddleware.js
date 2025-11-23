const multer = require("multer");

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPEG, JPG, PNG, or WEBP images are allowed'), false);
  }
  cb(null, true);
};

const limits = {
  fileSize: 5 * 1024 * 1024, 
};


 const upload = multer({ storage: multer.memoryStorage(),fileFilter,limits });

 module.exports = upload