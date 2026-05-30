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

router.post('/', auth, upload.single('avatar'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.avatar = `/uploads/${req.file.filename}`;
    res.status(201).json(await Feedback.create(data));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, upload.single('avatar'), async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...data } = req.body;
    if (req.file) data.avatar = `/uploads/${req.file.filename}`;
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
