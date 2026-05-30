const router = require('express').Router();
const auth   = require('../middleware/auth');
const multer = require('multer');
const Resume = require('../models/Resume');
const path   = require('path');
const fs     = require('fs');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.get('/download', async (req, res) => {
  const resume = await Resume.findOne().sort({ createdAt: -1 });
  if (!resume) return res.status(404).json({ message: 'No resume uploaded' });
  const filePath = path.join(__dirname, '..', resume.path);
  res.download(filePath, resume.filename);
});

router.post('/', auth, upload.single('resume'), async (req, res) => {
  try {
    await Resume.deleteMany({});
    const resume = await Resume.create({
      filename: req.file.originalname,
      path: `uploads/${req.file.filename}`
    });
    res.json(resume);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
