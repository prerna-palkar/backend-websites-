const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let members = [], workouts = [], plans = [];
app.get('/api/members', (req, res) => res.json(members));
app.post('/api/members', (req, res) => { const m = { id: uuidv4(), ...req.body, joinedAt: new Date() }; members.push(m); res.status(201).json(m); });
app.delete('/api/members/:id', (req, res) => { members = members.filter(m => m.id !== req.params.id); res.json({success:true}); });
app.get('/api/workouts', (req, res) => res.json(workouts));
app.post('/api/workouts', (req, res) => { const w = { id: uuidv4(), ...req.body, loggedAt: new Date() }; workouts.push(w); res.status(201).json(w); });
app.delete('/api/workouts/:id', (req, res) => { workouts = workouts.filter(w => w.id !== req.params.id); res.json({success:true}); });
app.get('/api/plans', (req, res) => res.json(plans));
app.post('/api/plans', (req, res) => { const p = { id: uuidv4(), ...req.body }; plans.push(p); res.status(201).json(p); });
app.delete('/api/plans/:id', (req, res) => { plans = plans.filter(p => p.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  💪 FitTrack Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
