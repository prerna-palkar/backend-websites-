const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let tickets = [], agents = [];
app.get('/api/tickets', (req, res) => res.json(tickets));
app.post('/api/tickets', (req, res) => { const t = { id: uuidv4(), ...req.body, status: 'Open', createdAt: new Date() }; tickets.push(t); res.status(201).json(t); });
app.patch('/api/tickets/:id', (req, res) => { const t = tickets.find(x => x.id === req.params.id); if(t) Object.assign(t, req.body); res.json(t); });
app.delete('/api/tickets/:id', (req, res) => { tickets = tickets.filter(t => t.id !== req.params.id); res.json({success:true}); });
app.get('/api/agents', (req, res) => res.json(agents));
app.post('/api/agents', (req, res) => { const a = { id: uuidv4(), ...req.body }; agents.push(a); res.status(201).json(a); });
app.delete('/api/agents/:id', (req, res) => { agents = agents.filter(a => a.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  💬 SupportBot Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
