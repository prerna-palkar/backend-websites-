const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let plans = [], subscribers = [];
app.get('/api/plans', (req, res) => res.json(plans));
app.post('/api/plans', (req, res) => { const p = { id: uuidv4(), ...req.body }; plans.push(p); res.status(201).json(p); });
app.delete('/api/plans/:id', (req, res) => { plans = plans.filter(p => p.id !== req.params.id); res.json({success:true}); });
app.get('/api/subscribers', (req, res) => res.json(subscribers));
app.post('/api/subscribers', (req, res) => { const s = { id: uuidv4(), ...req.body, status: 'Active', joinedAt: new Date() }; subscribers.push(s); res.status(201).json(s); });
app.patch('/api/subscribers/:id', (req, res) => { const s = subscribers.find(x => x.id === req.params.id); if(s) Object.assign(s, req.body); res.json(s); });
app.delete('/api/subscribers/:id', (req, res) => { subscribers = subscribers.filter(s => s.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  🔄 SubTrack Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
