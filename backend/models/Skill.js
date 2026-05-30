const mongoose = require('mongoose');
const SkillSchema = new mongoose.Schema({
  category:    { type: String, required: true },
  name:        { type: String, required: true },
  icon:        { type: String },
  proficiency: { type: Number, min: 1, max: 100, default: 80 },
  order:       { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Skill', SkillSchema);
