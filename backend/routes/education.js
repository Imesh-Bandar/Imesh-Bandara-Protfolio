const router    = require('express').Router();
const auth      = require('../middleware/auth');
const Education = require('../models/Education');

router.get('/', async (req, res) => {
  res.json(await Education.find().sort({ order: 1 }));
});

router.post('/', auth, async (req, res) => {
  try {
    res.status(201).json(await Education.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...data } = req.body;
    const edu = await Education.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!edu) return res.status(404).json({ message: 'Education not found' });
    res.json(edu);
  } catch (e) {
    console.error('PUT /education error:', e);
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await Education.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
