const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let stocks = [], portfolio = [], watchlist = [];
app.get('/api/stocks', (req, res) => res.json(stocks));
app.post('/api/stocks', (req, res) => { const s = { id: uuidv4(), ...req.body, change: (Math.random()*10-5).toFixed(2) }; stocks.push(s); res.status(201).json(s); });
app.delete('/api/stocks/:id', (req, res) => { stocks = stocks.filter(s => s.id !== req.params.id); res.json({success:true}); });
app.get('/api/portfolio', (req, res) => res.json(portfolio));
app.post('/api/portfolio', (req, res) => { const p = { id: uuidv4(), ...req.body }; portfolio.push(p); res.status(201).json(p); });
app.delete('/api/portfolio/:id', (req, res) => { portfolio = portfolio.filter(p => p.id !== req.params.id); res.json({success:true}); });
app.get('/api/watchlist', (req, res) => res.json(watchlist));
app.post('/api/watchlist', (req, res) => { const w = { id: uuidv4(), ...req.body }; watchlist.push(w); res.status(201).json(w); });
app.delete('/api/watchlist/:id', (req, res) => { watchlist = watchlist.filter(w => w.id !== req.params.id); res.json({success:true}); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  📈 StockTrack Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
