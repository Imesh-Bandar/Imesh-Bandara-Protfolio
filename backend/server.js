const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_ORIGIN || 'https://imeshbandara.netlify.app/,http://localhost:4200')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/about', require('./routes/about'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/tools', require('./routes/tools'));
app.use('/api/education', require('./routes/education'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/sdlc', require('./routes/sdlc'));

// Global error handler — catches Multer errors (e.g. "Unexpected field")
// and any other thrown errors so the client gets JSON instead of an HTML
// error page from Express's default handler.
const multer = require('multer');
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err.code, err.field);
    return res.status(400).json({
      message: `File upload error: ${err.message}${err.field ? ` (field: ${err.field})` : ''}`,
      code: err.code
    });
  }
  if (err) {
    console.error('Unhandled error:', err);
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
