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

// Use .any() so unexpected file field names don't crash with
// "MulterError: Unexpected field". We pick the named files manually below.
router.post('/', auth, upload.any(), async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...rest } = req.body;
    const data = { ...rest };
    const files = Array.isArray(req.files) ? req.files : [];
    const profile = files.find(f => f.fieldname === 'profileImage');
    const sig     = files.find(f => f.fieldname === 'signature');
    if (profile) data.profileImage = `/uploads/${profile.filename}`;
    if (sig)     data.signature    = `/uploads/${sig.filename}`;

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
