const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let documents = [], approvers = [];
app.get('/api/documents', (req, res) => res.json(documents));
app.post('/api/documents', (req, res) => { const d = { id: uuidv4(), ...req.body, status: 'Pending', createdAt: new Date() }; documents.push(d); res.status(201).json(d); });
app.patch('/api/documents/:id', (req, res) => { const d = documents.find(x => x.id === req.params.id); if(d) Object.assign(d, req.body); res.json(d); });
app.delete('/api/documents/:id', (req, res) => { documents = documents.filter(d => d.id !== req.params.id); res.json({success:true}); });
app.get('/api/approvers', (req, res) => res.json(approvers));
app.post('/api/approvers', (req, res) => { const a = { id: uuidv4(), ...req.body }; approvers.push(a); res.status(201).json(a); });
app.delete('/api/approvers/:id', (req, res) => { approvers = approvers.filter(a => a.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  📑 DocApprove Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
