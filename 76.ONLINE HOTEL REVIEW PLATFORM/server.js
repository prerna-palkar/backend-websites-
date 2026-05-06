const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// In-memory database
let hotels = [
    { id: 1, name: 'Luxury Plaza', location: 'New York', price: 250, rating: 4.8, reviews: ['Amazing stay!', 'Best hotel ever', 'Worth every penny'], image: '🏨' },
    { id: 2, name: 'Ocean View Resort', location: 'Miami', price: 180, rating: 4.6, reviews: ['Beautiful beach view', 'Great service', 'Perfect vacation'], image: '🏖️' },
    { id: 3, name: 'Mountain Haven', location: 'Denver', price: 120, rating: 4.5, reviews: ['Peaceful location', 'Friendly staff', 'Excellent breakfast'], image: '⛰️' },
    { id: 4, name: 'Downtown Elite', location: 'Chicago', price: 200, rating: 4.7, reviews: ['City center location', 'Luxury experience', 'Highly recommended'], image: '🌆' },
    { id: 5, name: 'Beach Paradise', location: 'Cancun', price: 150, rating: 4.4, reviews: ['Tropical paradise', 'All inclusive amazing', 'Best resort'], image: '🌴' }
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // GET all hotels
    if (pathname === '/api/hotels' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(hotels));
        return;
    }

    // GET single hotel
    if (pathname.match(/^\/api\/hotels\/\d+$/) && req.method === 'GET') {
        const id = parseInt(pathname.split('/')[3]);
        const hotel = hotels.find(h => h.id === id);
        if (hotel) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(hotel));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Hotel not found' }));
        }
        return;
    }

    // POST review
    if (pathname === '/api/reviews' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const { hotelId, review } = JSON.parse(body);
                const hotel = hotels.find(h => h.id === parseInt(hotelId));
                if (hotel) {
                    hotel.reviews.push(review);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Review added' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Hotel not found' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
        return;
    }

    // Serve index.html
    if (pathname === '/' || pathname === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
        return;
    }

    // Serve CSS
    if (pathname === '/styles.css') {
        fs.readFile(path.join(__dirname, 'styles.css'), (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
        return;
    }

    // Serve JS
    if (pathname === '/script.js') {
        fs.readFile(path.join(__dirname, 'script.js'), (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/javascript' });
                res.end(data);
            }
        });
        return;
    }

    res.writeHead(404);
    res.end('Not found');
});

server.listen(3000, () => {
    console.log('🏨 Hotel Review Platform running on http://localhost:3000');
});
