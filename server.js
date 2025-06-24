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

app.get('/news/:id', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'news.json');
  const newsList = JSON.parse(fs.readFileSync(dataPath));
  const newsItem = newsList[req.params.id];

  if (!newsItem) return res.status(404).send("News not found");

  const html = `
    <!DOCTYPE html>
    <html lang="te">
    <head>
      <meta charset="UTF-8">
      <title>${newsItem.title}</title>
      <meta property="og:type" content="article">
      <meta property="og:title" content="${newsItem.title}">
      <meta property="og:description" content="${newsItem.content.slice(0, 120)}">
      <meta property="og:image" content="https://desh-vani-app.onrender.com${newsItem.imageUrl}">
      <meta property="og:url" content="https://desh-vani-app.onrender.com/news/${req.params.id}">

      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${newsItem.title}">
      <meta name="twitter:description" content="${newsItem.content.slice(0, 120)}">
      <meta name="twitter:image" content="https://desh-vani-app.onrender.com${newsItem.imageUrl}">
    </head>
    <body>
      <h1>${newsItem.title}</h1>
      <img src="${newsItem.imageUrl}" style="max-width:100%;">
      <p>${newsItem.content}</p>
    </body>
    </html>
  `;

  res.send(html);
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
