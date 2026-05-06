const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let items = [], bids = [];
app.get('/api/items', (req, res) => res.json(items));
app.post('/api/items', (req, res) => { const i = { id: uuidv4(), ...req.body, currentBid: parseFloat(req.body.startingBid||0), status: 'Active', bidsCount: 0 }; items.push(i); res.status(201).json(i); });
app.patch('/api/items/:id/close', (req, res) => { const i = items.find(x => x.id === req.params.id); if(i) i.status = 'Closed'; res.json(i); });
app.delete('/api/items/:id', (req, res) => { items = items.filter(i => i.id !== req.params.id); res.json({success:true}); });
app.get('/api/bids', (req, res) => res.json(bids));
app.post('/api/bids', (req, res) => { const { itemId, bidder, amount } = req.body; const item = items.find(i => i.id === itemId); if(!item || item.status === 'Closed') return res.status(400).json({error:'Auction closed'}); if(parseFloat(amount) <= item.currentBid) return res.status(400).json({error:'Bid too low'}); const b = { id: uuidv4(), itemId, bidder, amount: parseFloat(amount), time: new Date() }; bids.push(b); item.currentBid = parseFloat(amount); item.bidsCount++; res.status(201).json(b); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  🔨 AuctionHub Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
