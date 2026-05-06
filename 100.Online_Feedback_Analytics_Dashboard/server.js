const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let surveys = [], responses = [];
app.get('/api/surveys', (req, res) => res.json(surveys));
app.post('/api/surveys', (req, res) => { const s = { id: uuidv4(), ...req.body, createdAt: new Date(), responseCount: 0 }; surveys.push(s); res.status(201).json(s); });
app.delete('/api/surveys/:id', (req, res) => { surveys = surveys.filter(s => s.id !== req.params.id); res.json({success:true}); });
app.get('/api/responses', (req, res) => res.json(responses));
app.post('/api/responses', (req, res) => { const r = { id: uuidv4(), ...req.body, submittedAt: new Date() }; responses.push(r); const s = surveys.find(x => x.id === r.surveyId); if(s) s.responseCount++; res.status(201).json(r); });
app.delete('/api/responses/:id', (req, res) => { responses = responses.filter(r => r.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  📊 FeedbackIQ Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
