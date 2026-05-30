const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  techStack:   [String],
  image:       { type: String },
  githubUrl:   { type: String },
  liveUrl:     { type: String },
  ownerName:   { type: String },
  ownerEmail:  { type: String },
  order:       { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Project', ProjectSchema);
