const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let properties = [], agents = [], inquiries = [];
app.get('/api/properties', (req, res) => res.json(properties));
app.post('/api/properties', (req, res) => { const p = { id: uuidv4(), ...req.body, listedAt: new Date() }; properties.push(p); res.status(201).json(p); });
app.delete('/api/properties/:id', (req, res) => { properties = properties.filter(p => p.id !== req.params.id); res.json({success:true}); });
app.get('/api/agents', (req, res) => res.json(agents));
app.post('/api/agents', (req, res) => { const a = { id: uuidv4(), ...req.body }; agents.push(a); res.status(201).json(a); });
app.delete('/api/agents/:id', (req, res) => { agents = agents.filter(a => a.id !== req.params.id); res.json({success:true}); });
app.get('/api/inquiries', (req, res) => res.json(inquiries));
app.post('/api/inquiries', (req, res) => { const i = { id: uuidv4(), ...req.body, status: 'New', submittedAt: new Date() }; inquiries.push(i); res.status(201).json(i); });
app.patch('/api/inquiries/:id', (req, res) => { const i = inquiries.find(x => x.id === req.params.id); if(i) Object.assign(i, req.body); res.json(i); });
app.delete('/api/inquiries/:id', (req, res) => { inquiries = inquiries.filter(i => i.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  🏠 RealEstateHub Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
