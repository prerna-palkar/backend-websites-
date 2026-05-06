const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let problems = [], submissions = [];
app.get('/api/problems', (req, res) => res.json(problems));
app.post('/api/problems', (req, res) => { const p = { id: uuidv4(), ...req.body }; problems.push(p); res.status(201).json(p); });
app.delete('/api/problems/:id', (req, res) => { problems = problems.filter(p => p.id !== req.params.id); res.json({success:true}); });
app.get('/api/submissions', (req, res) => res.json(submissions));
app.post('/api/submissions', (req, res) => { const passed = Math.random() > 0.4; const s = { id: uuidv4(), ...req.body, status: passed ? 'Passed' : 'Failed', score: passed ? Math.floor(Math.random()*30)+70 : Math.floor(Math.random()*40), submittedAt: new Date() }; submissions.push(s); res.status(201).json(s); });
app.delete('/api/submissions/:id', (req, res) => { submissions = submissions.filter(s => s.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  💻 CodeSubmit Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
