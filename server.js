const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' }
];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, role: user.role });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/news', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'news.json');
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, '[]');
  const news = JSON.parse(fs.readFileSync(dataPath));
  res.json(news);
});

app.post('/news', upload.single('image'), (req, res) => {
  const { title, content } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Image is required' });
  }

  const imageUrl = '/uploads/' + req.file.filename;
  const dataPath = path.join(__dirname, 'data', 'news.json');

  const news = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath)) : [];
  news.unshift({ title, content, imageUrl });
  fs.writeFileSync(dataPath, JSON.stringify(news, null, 2));

  res.json({ success: true });
});

// ✅ Add these two routes:
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
