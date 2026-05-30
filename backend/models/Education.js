const mongoose = require('mongoose');
const EducationSchema = new mongoose.Schema({
  type:        { type: String, enum: ['degree', 'diploma', 'certification'], required: true },
  title:       { type: String, required: true },
  institution: { type: String, required: true },
  grade:       { type: String },
  startDate:   { type: String },
  endDate:     { type: String },
  status:      { type: String, enum: ['completed', 'in-progress'], default: 'completed' },
  order:       { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Education', EducationSchema);
