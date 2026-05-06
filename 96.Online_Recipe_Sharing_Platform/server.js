const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors()); app.use(express.json()); app.use(express.static('.'));

let recipes = [], chefs = [], categories = [];
app.get('/api/recipes', (req, res) => res.json(recipes));
app.post('/api/recipes', (req, res) => { const r = { id: uuidv4(), ...req.body, rating: 0, reviews: 0 }; recipes.push(r); res.status(201).json(r); });
app.delete('/api/recipes/:id', (req, res) => { recipes = recipes.filter(r => r.id !== req.params.id); res.json({success:true}); });
app.get('/api/chefs', (req, res) => res.json(chefs));
app.post('/api/chefs', (req, res) => { const c = { id: uuidv4(), ...req.body }; chefs.push(c); res.status(201).json(c); });
app.delete('/api/chefs/:id', (req, res) => { chefs = chefs.filter(c => c.id !== req.params.id); res.json({success:true}); });
app.get('/api/categories', (req, res) => res.json(categories));
app.post('/api/categories', (req, res) => { const c = { id: uuidv4(), ...req.body }; categories.push(c); res.status(201).json(c); });

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  🚀  🍳 RecipeShare Server Started  ║');
    console.log(`║  📡  http://localhost:${PORT}                     ║`);
    console.log('║  ✅  Server running successfully               ║');
    console.log('╚══════════════════════════════════════════════╝\n');
});
