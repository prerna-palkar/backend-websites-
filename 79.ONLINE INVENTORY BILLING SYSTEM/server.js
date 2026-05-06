const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

let inventory = [
    { id: 1, name: 'Laptop Pro 15', category: 'Electronics', price: 1299.99, stock: 15 },
    { id: 2, name: 'Wireless Mouse', category: 'Electronics', price: 29.99, stock: 50 },
    { id: 3, name: 'USB-C Cable', category: 'Electronics', price: 15.99, stock: 100 },
    { id: 4, name: 'Designer T-Shirt', category: 'Clothing', price: 49.99, stock: 25 },
    { id: 5, name: 'Denim Jeans', category: 'Clothing', price: 79.99, stock: 30 },
    { id: 6, name: 'Coffee Beans', category: 'Food', price: 12.99, stock: 60 },
    { id: 7, name: 'Python Programming', category: 'Books', price: 45.99, stock: 20 },
    { id: 8, name: 'JavaScript Guide', category: 'Books', price: 39.99, stock: 35 }
];

let invoices = [];
let currentProductId = 9;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/inventory', (req, res) => {
    res.json(inventory);
});

app.get('/api/inventory/:id', (req, res) => {
    const product = inventory.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

app.post('/api/inventory', (req, res) => {
    const newProduct = {
        id: currentProductId++,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock
    };
    inventory.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/api/inventory/:id', (req, res) => {
    const product = inventory.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
    
    res.json(product);
});

app.delete('/api/inventory/:id', (req, res) => {
    const index = inventory.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Product not found' });
    
    const deletedProduct = inventory.splice(index, 1);
    res.json(deletedProduct[0]);
});

app.get('/api/invoices', (req, res) => {
    res.json(invoices);
});

app.post('/api/invoices', (req, res) => {
    const invoice = {
        id: invoices.length + 1,
        items: req.body.items,
        subtotal: req.body.subtotal,
        tax: req.body.tax,
        total: req.body.total,
        paymentMethod: req.body.paymentMethod,
        date: new Date().toISOString()
    };
    invoices.push(invoice);
    res.status(201).json(invoice);
});

app.get('/api/reports', (req, res) => {
    const reports = {
        totalProducts: inventory.length,
        lowStockItems: inventory.filter(p => p.stock < 10 && p.stock > 0).length,
        outOfStock: inventory.filter(p => p.stock === 0).length,
        totalValue: inventory.reduce((sum, p) => sum + (p.price * p.stock), 0),
        totalTransactions: invoices.length,
        totalRevenue: invoices.reduce((sum, inv) => sum + inv.total, 0)
    };
    res.json(reports);
});

app.listen(PORT, () => {
    console.log(`\n✅ Inventory Billing System running on http://localhost:${PORT}`);
    console.log(`📊 Visit http://localhost:${PORT} in your browser\n`);
});
