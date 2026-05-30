const mongoose = require('mongoose');
const FeedbackSchema = new mongoose.Schema({
  clientName:  { type: String, required: true },
  clientRole:  { type: String },
  company:     { type: String },
  message:     { type: String, required: true },
  rating:      { type: Number, min: 1, max: 5, default: 5 },
  avatar:      { type: String },
  approved:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Feedback', FeedbackSchema);
