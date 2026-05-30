const router = require('express').Router();
const auth   = require('../middleware/auth');
const Sdlc   = require('../models/Sdlc');

router.get('/', async (req, res) => {
  res.json(await Sdlc.find().sort({ order: 1 }));
});

router.post('/', auth, async (req, res) => {
  try {
    res.status(201).json(await Sdlc.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...data } = req.body;
    const sdlc = await Sdlc.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!sdlc) return res.status(404).json({ message: 'Phase not found' });
    res.json(sdlc);
  } catch (e) {
    console.error('PUT /sdlc error:', e);
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  await Sdlc.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
