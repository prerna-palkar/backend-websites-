const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let classes = [], students = [], assignments = [];
app.get('/api/classes', (req, res) => res.json(classes));
app.post('/api/classes', (req, res) => { const c = { id: uuidv4(), ...req.body }; classes.push(c); res.status(201).json(c); });
app.delete('/api/classes/:id', (req, res) => { classes = classes.filter(c => c.id !== req.params.id); res.json({success:true}); });
app.get('/api/students', (req, res) => res.json(students));
app.post('/api/students', (req, res) => { const s = { id: uuidv4(), ...req.body }; students.push(s); res.status(201).json(s); });
app.delete('/api/students/:id', (req, res) => { students = students.filter(s => s.id !== req.params.id); res.json({success:true}); });
app.get('/api/assignments', (req, res) => res.json(assignments));
app.post('/api/assignments', (req, res) => { const a = { id: uuidv4(), ...req.body, createdAt: new Date() }; assignments.push(a); res.status(201).json(a); });
app.delete('/api/assignments/:id', (req, res) => { assignments = assignments.filter(a => a.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  🏫 ClassPortal Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
