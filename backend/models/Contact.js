const mongoose = require('mongoose');
const ContactSchema = new mongoose.Schema({
  email:     { type: String, required: true },
  whatsapp:  { type: String },
  linkedin:  { type: String },
  facebook:  { type: String },
  github:    { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Contact', ContactSchema);
