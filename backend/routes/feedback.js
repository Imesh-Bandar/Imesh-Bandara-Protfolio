const router   = require('express').Router();
const auth     = require('../middleware/auth');
const multer   = require('multer');
const Feedback = require('../models/Feedback');
const path     = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Public: only approved
router.get('/', async (req, res) => {
  res.json(await Feedback.find({ approved: true }).sort({ order: 1 }));
});

// Admin: all feedback
router.get('/all', auth, async (req, res) => {
  res.json(await Feedback.find().sort({ createdAt: -1 }));
});

const pickAvatar = (req) => {
  if (req.file) return req.file;
  const files = Array.isArray(req.files) ? req.files : [];
  return files.find(f => f.fieldname === 'avatar');
};

router.post('/', auth, upload.any(), async (req, res) => {
  try {
    const data = { ...req.body };
    const av = pickAvatar(req);
    if (av) data.avatar = `/uploads/${av.filename}`;
    res.status(201).json(await Feedback.create(data));
  } catch (e) {
    console.error('POST /feedback error:', e);
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, upload.any(), async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...data } = req.body;
    const av = pickAvatar(req);
    if (av) data.avatar = `/uploads/${av.filename}`;
    const fb = await Feedback.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!fb) return res.status(404).json({ message: 'Feedback not found' });
    res.json(fb);
  } catch (e) {
    console.error('PUT /feedback error:', e);
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
