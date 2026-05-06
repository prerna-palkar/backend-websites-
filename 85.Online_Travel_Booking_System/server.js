const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let destinations = [], bookings = [], travelers = [];
app.get('/api/destinations', (req, res) => res.json(destinations));
app.post('/api/destinations', (req, res) => { const d = { id: uuidv4(), ...req.body }; destinations.push(d); res.status(201).json(d); });
app.delete('/api/destinations/:id', (req, res) => { destinations = destinations.filter(d => d.id !== req.params.id); res.json({success:true}); });
app.get('/api/bookings', (req, res) => res.json(bookings));
app.post('/api/bookings', (req, res) => { const b = { id: uuidv4(), ...req.body, bookedAt: new Date() }; bookings.push(b); res.status(201).json(b); });
app.delete('/api/bookings/:id', (req, res) => { bookings = bookings.filter(b => b.id !== req.params.id); res.json({success:true}); });
app.get('/api/travelers', (req, res) => res.json(travelers));
app.post('/api/travelers', (req, res) => { const t = { id: uuidv4(), ...req.body }; travelers.push(t); res.status(201).json(t); });
app.delete('/api/travelers/:id', (req, res) => { travelers = travelers.filter(t => t.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  ✈ TravelEase Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
