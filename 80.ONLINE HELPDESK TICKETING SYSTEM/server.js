const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

let tickets = [];

function generateTicketId() {
    return 'TKT' + Date.now().toString().slice(-8);
}

app.get('/api/tickets', (req, res) => {
    res.json(tickets);
});

app.post('/api/tickets', (req, res) => {
    const { name, email, subject, category, priority, description } = req.body;

    if (!name || !email || !subject || !category || !priority || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const ticket = {
        id: generateTicketId(),
        name,
        email,
        subject,
        category,
        priority,
        description,
        status: 'Open',
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tickets.unshift(ticket);
    res.status(201).json(ticket);
});

app.get('/api/tickets/:id', (req, res) => {
    const ticket = tickets.find(t => t.id === req.params.id);
    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
});

app.put('/api/tickets/:id', (req, res) => {
    const ticket = tickets.find(t => t.id === req.params.id);
    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    if (req.body.status) ticket.status = req.body.status;
    if (req.body.priority) ticket.priority = req.body.priority;
    if (req.body.notes !== undefined) ticket.notes = req.body.notes;

    ticket.updatedAt = new Date().toISOString();
    res.json(ticket);
});

app.delete('/api/tickets/:id', (req, res) => {
    const index = tickets.findIndex(t => t.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    const deletedTicket = tickets.splice(index, 1);
    res.json(deletedTicket[0]);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 HelpDesk Ticketing System running at http://localhost:${PORT}`);
    console.log(`📝 Open your browser and navigate to http://localhost:${PORT}`);
});
