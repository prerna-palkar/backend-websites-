const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let events = [], bookings = [];
app.get('/api/events', (req, res) => res.json(events));
app.post('/api/events', (req, res) => { const e = { id: uuidv4(), ...req.body, sold: 0 }; events.push(e); res.status(201).json(e); });
app.delete('/api/events/:id', (req, res) => { events = events.filter(e => e.id !== req.params.id); res.json({success:true}); });
app.get('/api/bookings', (req, res) => res.json(bookings));
app.post('/api/bookings', (req, res) => { const b = { id: uuidv4(), ...req.body, bookedAt: new Date() }; bookings.push(b); res.status(201).json(b); });
app.delete('/api/bookings/:id', (req, res) => { bookings = bookings.filter(b => b.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  🎟 EventPass Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
