const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let songs = [], playlists = [], artists = [];
app.get('/api/songs', (req, res) => res.json(songs));
app.post('/api/songs', (req, res) => { const s = { id: uuidv4(), ...req.body, plays: 0 }; songs.push(s); res.status(201).json(s); });
app.patch('/api/songs/:id/play', (req, res) => { const s = songs.find(x => x.id === req.params.id); if(s) s.plays++; res.json(s); });
app.delete('/api/songs/:id', (req, res) => { songs = songs.filter(s => s.id !== req.params.id); res.json({success:true}); });
app.get('/api/playlists', (req, res) => res.json(playlists));
app.post('/api/playlists', (req, res) => { const p = { id: uuidv4(), ...req.body, songs: [] }; playlists.push(p); res.status(201).json(p); });
app.delete('/api/playlists/:id', (req, res) => { playlists = playlists.filter(p => p.id !== req.params.id); res.json({success:true}); });
app.get('/api/artists', (req, res) => res.json(artists));
app.post('/api/artists', (req, res) => { const a = { id: uuidv4(), ...req.body }; artists.push(a); res.status(201).json(a); });
app.delete('/api/artists/:id', (req, res) => { artists = artists.filter(a => a.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  🎵 MusicStream Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
