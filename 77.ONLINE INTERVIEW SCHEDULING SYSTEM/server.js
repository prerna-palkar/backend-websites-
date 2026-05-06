const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

let users = [];
let interviews = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/register', (req, res) => {
  const { email, password, name, role } = req.body;
  
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const user = {
    id: uuidv4(),
    email,
    password,
    name,
    role,
    createdAt: new Date()
  };

  users.push(user);
  res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post('/api/schedule-interview', (req, res) => {
  const { userId, candidateName, candidateEmail, position, dateTime, duration, interviewer } = req.body;

  if (!userId || !candidateName || !candidateEmail || !position || !dateTime || !duration) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const interview = {
    id: uuidv4(),
    userId,
    candidateName,
    candidateEmail,
    position,
    dateTime,
    duration,
    interviewer: interviewer || 'To be assigned',
    status: 'scheduled',
    createdAt: new Date(),
    meetingLink: `https://meet.example.com/${uuidv4().substr(0, 8)}`
  };

  interviews.push(interview);
  res.json({ success: true, interview });
});

app.get('/api/interviews/:userId', (req, res) => {
  const { userId } = req.params;
  const userInterviews = interviews.filter(i => i.userId === userId);
  res.json({ interviews: userInterviews });
});

app.get('/api/all-interviews', (req, res) => {
  res.json({ interviews });
});

app.put('/api/interview/:interviewId', (req, res) => {
  const { interviewId } = req.params;
  const { status, dateTime, interviewer } = req.body;

  const interview = interviews.find(i => i.id === interviewId);
  if (!interview) {
    return res.status(404).json({ error: 'Interview not found' });
  }

  if (status) interview.status = status;
  if (dateTime) interview.dateTime = dateTime;
  if (interviewer) interview.interviewer = interviewer;

  res.json({ success: true, interview });
});

app.delete('/api/interview/:interviewId', (req, res) => {
  const { interviewId } = req.params;
  interviews = interviews.filter(i => i.id !== interviewId);
  res.json({ success: true });
});

app.post('/api/reschedule-interview', (req, res) => {
  const { interviewId, newDateTime } = req.body;

  const interview = interviews.find(i => i.id === interviewId);
  if (!interview) {
    return res.status(404).json({ error: 'Interview not found' });
  }

  interview.dateTime = newDateTime;
  interview.status = 'rescheduled';

  res.json({ success: true, interview });
});

app.get('/api/stats', (req, res) => {
  const stats = {
    totalUsers: users.length,
    totalInterviews: interviews.length,
    scheduledInterviews: interviews.filter(i => i.status === 'scheduled').length,
    completedInterviews: interviews.filter(i => i.status === 'completed').length,
    cancelledInterviews: interviews.filter(i => i.status === 'cancelled').length
  };
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Interview Scheduling System is ready!`);
});
