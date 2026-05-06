const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let rooms = [], bookings = [];
app.get('/api/rooms', (req, res) => res.json(rooms));
app.post('/api/rooms', (req, res) => { const r = { id: uuidv4(), ...req.body, available: true }; rooms.push(r); res.status(201).json(r); });
app.delete('/api/rooms/:id', (req, res) => { rooms = rooms.filter(r => r.id !== req.params.id); res.json({success:true}); });
app.get('/api/bookings', (req, res) => res.json(bookings));
app.post('/api/bookings', (req, res) => { const b = { id: uuidv4(), ...req.body, bookedAt: new Date() }; bookings.push(b); res.status(201).json(b); });
app.delete('/api/bookings/:id', (req, res) => { bookings = bookings.filter(b => b.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  🏢 RoomBook Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
