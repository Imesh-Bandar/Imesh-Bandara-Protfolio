const mongoose = require('mongoose');
const SdlcSchema = new mongoose.Schema({
  phase:       { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  icon:        { type: String },
  order:       { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Sdlc', SdlcSchema);
