const mongoose = require('mongoose');
const ToolSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  icon:  { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Tool', ToolSchema);
