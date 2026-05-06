const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let courses = [], students = [], progress = [];
app.get('/api/courses', (req, res) => res.json(courses));
app.post('/api/courses', (req, res) => { const c = { id: uuidv4(), ...req.body }; courses.push(c); res.status(201).json(c); });
app.delete('/api/courses/:id', (req, res) => { courses = courses.filter(c => c.id !== req.params.id); res.json({success:true}); });
app.get('/api/students', (req, res) => res.json(students));
app.post('/api/students', (req, res) => { const s = { id: uuidv4(), ...req.body }; students.push(s); res.status(201).json(s); });
app.delete('/api/students/:id', (req, res) => { students = students.filter(s => s.id !== req.params.id); res.json({success:true}); });
app.get('/api/progress', (req, res) => res.json(progress));
app.post('/api/progress', (req, res) => { const p = { id: uuidv4(), ...req.body, updatedAt: new Date() }; progress.push(p); res.status(201).json(p); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  📊 LearnTrack Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
