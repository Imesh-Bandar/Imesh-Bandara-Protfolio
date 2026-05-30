const mongoose = require('mongoose');
const ResumeSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path:     { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Resume', ResumeSchema);
