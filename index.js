// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'students.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));

let students = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');

function save() { fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2)); }
function makeId(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

function validate(body) {
  const errs = [];
  if (!body.name || String(body.name).trim()==='') errs.push('name required');
  if (body.age === undefined || Number.isNaN(Number(body.age)) || Number(body.age) <= 0) errs.push('valid age required');
  if (!body.course || String(body.course).trim()==='') errs.push('course required');
  if (!body.year || String(body.year).trim()==='') errs.push('year required');
  return errs;
}

app.get('/', (req, res) => res.send('Student Management API — root'));
app.get('/students', (req, res) => res.json({ success: true, data: students }));

app.post('/students', (req, res) => {
  const errors = validate(req.body || {});
  if (errors.length) return res.status(400).json({ success: false, errors });
  const s = {
    id: makeId(),
    name: String(req.body.name).trim(),
    age: Number(req.body.age),
    course: String(req.body.course).trim(),
    year: String(req.body.year).trim(),
    status: req.body.status ? String(req.body.status).trim() : 'active',
    createdAt: new Date().toISOString()
  };
  students.push(s);
  save();
  res.status(201).json({ success: true, data: s });
});

app.use((req, res) => res.status(404).send('Not Found'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
