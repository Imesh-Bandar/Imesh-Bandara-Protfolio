const router  = require('express').Router();
const auth    = require('../middleware/auth');
const multer  = require('multer');
const About   = require('../models/About');
const path    = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const prefix = file.fieldname === 'signature' ? 'signature' : 'profile';
    cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const about = await About.findOne().sort({ createdAt: -1 });
  res.json(about);
});

router.post('/', auth, upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'signature', maxCount: 1 }]), async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...rest } = req.body;
    const data = { ...rest };
    if (req.files?.profileImage?.[0]) data.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
    if (req.files?.signature?.[0])    data.signature    = `/uploads/${req.files.signature[0].filename}`;
    const existing = await About.findOne().sort({ createdAt: -1 });
    let about;
    if (existing) {
      // findByIdAndUpdate only changes keys present in `data`, so existing
      // signature / profileImage are preserved when no new file is uploaded.
      about = await About.findByIdAndUpdate(existing._id, data, { new: true, runValidators: true });
    } else {
      about = await About.create(data);
    }
    res.json(about);
  } catch (e) {
    console.error('POST /about error:', e);
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
