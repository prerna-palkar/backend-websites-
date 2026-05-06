const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let projects = [], volunteers = [], donations = [];
app.get('/api/projects', (req, res) => res.json(projects));
app.post('/api/projects', (req, res) => { const p = { id: uuidv4(), ...req.body, status: 'Active' }; projects.push(p); res.status(201).json(p); });
app.delete('/api/projects/:id', (req, res) => { projects = projects.filter(p => p.id !== req.params.id); res.json({success:true}); });
app.get('/api/volunteers', (req, res) => res.json(volunteers));
app.post('/api/volunteers', (req, res) => { const v = { id: uuidv4(), ...req.body, joinedAt: new Date() }; volunteers.push(v); res.status(201).json(v); });
app.delete('/api/volunteers/:id', (req, res) => { volunteers = volunteers.filter(v => v.id !== req.params.id); res.json({success:true}); });
app.get('/api/donations', (req, res) => res.json(donations));
app.post('/api/donations', (req, res) => { const d = { id: uuidv4(), ...req.body, donatedAt: new Date() }; donations.push(d); res.status(201).json(d); });
app.delete('/api/donations/:id', (req, res) => { donations = donations.filter(d => d.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  🤝 NGOHub Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
