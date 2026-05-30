const router = require('express').Router();
const auth   = require('../middleware/auth');
const Tool   = require('../models/Tool');

router.get('/', async (req, res) => {
  res.json(await Tool.find().sort({ order: 1 }));
});

router.post('/', auth, async (req, res) => {
  try {
    res.status(201).json(await Tool.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...data } = req.body;
    const tool = await Tool.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    res.json(tool);
  } catch (e) {
    console.error('PUT /tools error:', e);
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await Tool.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
