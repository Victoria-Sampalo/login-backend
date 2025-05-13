const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Card', cardSchema);
