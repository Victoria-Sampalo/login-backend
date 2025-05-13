const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const card = new Card({ ...req.body, owner: req.user.userId });
  await card.save();
  res.send({ message: 'Tarjeta guardada' });
});

router.get('/', auth, async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { owner: req.user.userId };
  const cards = await Card.find(query);
  res.send(cards);
});

module.exports = router;
