const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let posts = [], authors = [], categories = [];
app.get('/api/posts', (req, res) => res.json(posts));
app.post('/api/posts', (req, res) => { const p = { id: uuidv4(), ...req.body, views: 0, createdAt: new Date() }; posts.push(p); res.status(201).json(p); });
app.patch('/api/posts/:id', (req, res) => { const p = posts.find(x => x.id === req.params.id); if(p) Object.assign(p, req.body); res.json(p); });
app.delete('/api/posts/:id', (req, res) => { posts = posts.filter(p => p.id !== req.params.id); res.json({success:true}); });
app.get('/api/authors', (req, res) => res.json(authors));
app.post('/api/authors', (req, res) => { const a = { id: uuidv4(), ...req.body }; authors.push(a); res.status(201).json(a); });
app.delete('/api/authors/:id', (req, res) => { authors = authors.filter(a => a.id !== req.params.id); res.json({success:true}); });
app.get('/api/categories', (req, res) => res.json(categories));
app.post('/api/categories', (req, res) => { const c = { id: uuidv4(), ...req.body }; categories.push(c); res.status(201).json(c); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  ✍ BlogCMS Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
