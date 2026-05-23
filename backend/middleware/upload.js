const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB for videos
  fileFilter: (req, file, cb) => {
    const allowedImage = /jpeg|jpg|png|webp/;
    const allowedVideo = /mp4|mov|avi|mkv|webm/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowedImage.test(ext) || allowedVideo.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files allowed'));
    }
  }
});

module.exports = upload;