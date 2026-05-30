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

const parseTechStack = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.flatMap(parseTechStack);
  try { return JSON.parse(raw); }
  catch { return String(raw).split(',').map(s => s.trim()).filter(Boolean); }
};

const pickImage = (req) => {
  if (req.file) return req.file;
  const files = Array.isArray(req.files) ? req.files : [];
  return files.find(f => f.fieldname === 'image');
};

router.post('/', auth, upload.any(), async (req, res) => {
  try {
    const data = { ...req.body, techStack: parseTechStack(req.body.techStack)};
    const img = pickImage(req);
    if (img) data.image = `/uploads/${img.filename}`;
    const project = await Project.create(data);
    res.status(201).json(project);
  } catch (e) {
    console.error('POST /projects error:', e);
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, upload.any(), async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...rest } = req.body;
    const data = { ...rest, techStack: parseTechStack(req.body.techStack)};
    const img = pickImage(req);
    if (img) data.image = `/uploads/${img.filename}`;
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

/**
 * PUT /reorder
 * Body: { ids: ["id1","id2","id3"...] } — array of project ids in the
 * desired display order. Sets order=index for each.
 */
router.put('/reorder/bulk', auth, async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    if (!ids.length) return res.status(400).json({ message: 'ids array required' });
    const ops = ids.map((id, i) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: i } } }
    }));
    await Project.bulkWrite(ops);
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (e) {
    console.error('PUT /projects/reorder error:', e);
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
