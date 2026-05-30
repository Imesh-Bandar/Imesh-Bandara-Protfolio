const router = require('express').Router();
const auth   = require('../middleware/auth');
const Skill  = require('../models/Skill');

router.get('/', async (req, res) => {
  const skills = await Skill.find().sort({ order: 1 });
  res.json(skills);
});

router.post('/', auth, async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...data } = req.body;
    const skill = await Skill.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json(skill);
  } catch (e) {
    console.error('PUT /skills error:', e);
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
