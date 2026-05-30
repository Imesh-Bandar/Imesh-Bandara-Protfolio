const router  = require('express').Router();
const auth    = require('../middleware/auth');
const Contact = require('../models/Contact');

router.get('/', async (req, res) => {
  res.json(await Contact.findOne().sort({ createdAt: -1 }));
});

router.post('/', auth, async (req, res) => {
  try {
    await Contact.deleteMany({});
    res.json(await Contact.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
