const mongoose = require('mongoose');
const AboutSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  title:       { type: String, required: true },
  bio:         { type: String, required: true },
  profileImage:{ type: String },
  signature:   { type: String },
  yearsOfExp:  { type: Number, default: 3 },
  location:    { type: String },
  tagline:     { type: String }
}, { timestamps: true });
module.exports = mongoose.model('About', AboutSchema);
