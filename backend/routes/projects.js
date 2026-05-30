const router  = require('express').Router();
const auth    = require('../middleware/auth');
const multer  = require('multer');
const Project = require('../models/Project');
const path    = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `project-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json(projects);
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body, techStack: JSON.parse(req.body.techStack || '[]') };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const project = await Project.create(data);
    res.status(201).json(project);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...rest } = req.body;
    const data = { ...rest, techStack: JSON.parse(req.body.techStack || '[]') };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (e) {
    console.error('PUT /projects error:', e);
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
