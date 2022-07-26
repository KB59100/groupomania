const multer = require('multer');

// Create a MIME_TYPES dictionary with accepted file types

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

// File storage management with Multer

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Validate files

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if(!allowedTypes.includes(file.mimetype)) {
    const error = new Error();
    error.code = "LIMIT_FILE_TYPES";
    error.message = "Wrong file type !";
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({

  fileFilter,
  limits: { fileSize: 1048576 },
  storage

}).single('image');

// Exports

module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if(err && err.code === "LIMIT_FILE_SIZE") {
      err.message = "file too large, max size = 1 MB";
    }
    return err ? res.status(400).json(err) : next()
  });
};