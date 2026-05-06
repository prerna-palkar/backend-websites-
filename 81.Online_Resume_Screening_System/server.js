const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let resumes = [], jobs = [], screenings = [];

app.get('/api/jobs', (req, res) => res.json(jobs));
app.post('/api/jobs', (req, res) => { const job = { id: uuidv4(), ...req.body, createdAt: new Date() }; jobs.push(job); res.status(201).json(job); });
app.delete('/api/jobs/:id', (req, res) => { jobs = jobs.filter(j => j.id !== req.params.id); res.json({ success: true }); });

app.get('/api/resumes', (req, res) => res.json(resumes));
app.post('/api/resumes', (req, res) => { const resume = { id: uuidv4(), ...req.body, uploadedAt: new Date() }; resumes.push(resume); res.status(201).json(resume); });
app.delete('/api/resumes/:id', (req, res) => { resumes = resumes.filter(r => r.id !== req.params.id); res.json({ success: true }); });

app.get('/api/screenings', (req, res) => res.json(screenings));
app.post('/api/screenings', (req, res) => {
  const { resumeId, jobId } = req.body;
  const resume = resumes.find(r => r.id === resumeId);
  const job = jobs.find(j => j.id === jobId);
  const score = Math.floor(Math.random() * 40) + 60;
  const screening = { id: uuidv4(), resumeId, jobId, score, status: score >= 75 ? 'Shortlisted' : 'Rejected', screenedAt: new Date() };
  screenings.push(screening);
  res.status(201).json(screening);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
