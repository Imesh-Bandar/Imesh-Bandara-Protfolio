const router     = require('express').Router();
const auth       = require('../middleware/auth');
const Experience = require('../models/Experience');

router.get('/', async (req, res) => {
  res.json(await Experience.find().sort({ order: 1 }));
});

router.post('/', auth, async (req, res) => {
  try {
    res.status(201).json(await Experience.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...data } = req.body;
    const exp = await Experience.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!exp) return res.status(404).json({ message: 'Experience not found' });
    res.json(exp);
  } catch (e) {
    console.error('PUT /experience error:', e);
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
