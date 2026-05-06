const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let employees = [], leaves = [], holidays = [];
app.get('/api/employees', (req, res) => res.json(employees));
app.post('/api/employees', (req, res) => { const e = { id: uuidv4(), ...req.body, leavesLeft: 20 }; employees.push(e); res.status(201).json(e); });
app.delete('/api/employees/:id', (req, res) => { employees = employees.filter(e => e.id !== req.params.id); res.json({success:true}); });
app.get('/api/leaves', (req, res) => res.json(leaves));
app.post('/api/leaves', (req, res) => { const l = { id: uuidv4(), ...req.body, status: 'Pending', appliedAt: new Date() }; leaves.push(l); res.status(201).json(l); });
app.patch('/api/leaves/:id', (req, res) => { const l = leaves.find(x => x.id === req.params.id); if(l) Object.assign(l, req.body); res.json(l); });
app.delete('/api/leaves/:id', (req, res) => { leaves = leaves.filter(l => l.id !== req.params.id); res.json({success:true}); });
app.get('/api/holidays', (req, res) => res.json(holidays));
app.post('/api/holidays', (req, res) => { const h = { id: uuidv4(), ...req.body }; holidays.push(h); res.status(201).json(h); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  🏖 LeaveManager Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
