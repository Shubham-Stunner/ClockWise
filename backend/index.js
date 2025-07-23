import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK || '';

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Mongo connected')).catch(err => console.error(err));

// Models
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  punchIn: Date,
  punchOut: Date,
});

const User = mongoose.model('User', userSchema);
const AttendanceRecord = mongoose.model('AttendanceRecord', attendanceSchema);

// Helpers
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Routes
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'User not found' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid password' });
  const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET);
  res.json({ token });
});

app.post('/punchin', authMiddleware, async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  let record = await AttendanceRecord.findOne({ userId: req.user.id, date: today });
  if (!record) {
    record = new AttendanceRecord({ userId: req.user.id, date: today });
  }
  record.punchIn = new Date();
  await record.save();
  res.json(record);
});

app.post('/punchout', authMiddleware, async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  let record = await AttendanceRecord.findOne({ userId: req.user.id, date: today });
  if (!record) return res.status(400).json({ error: 'No punch in found' });
  record.punchOut = new Date();
  await record.save();

  // Alert if more than 12h
  const diff = (record.punchOut - record.punchIn) / 3600000;
  if (diff > 12 && SLACK_WEBHOOK) {
    await axios.post(SLACK_WEBHOOK, { text: `User ${req.user.email} logged ${diff.toFixed(2)} hours today` });
  }

  res.json(record);
});

app.get('/summary', authMiddleware, async (req, res) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const records = await AttendanceRecord.find({
    userId: req.user.id,
    date: { $gte: startOfWeek.toISOString().slice(0, 10) },
  });

  let todayHours = 0;
  let weekHours = 0;
  records.forEach(r => {
    if (r.punchIn && r.punchOut) {
      const hours = (r.punchOut - r.punchIn) / 3600000;
      weekHours += hours;
      if (r.date === today.toISOString().slice(0, 10)) todayHours = hours;
    }
  });

  res.json({ todayHours, weekHours });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
