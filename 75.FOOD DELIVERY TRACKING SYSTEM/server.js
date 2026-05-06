const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Store orders in memory
let orders = [];
let orderCounter = 1000;

// Delivery statuses
const statuses = ['Confirmed', 'Preparing Food', 'Out for Delivery', 'Delivered'];
let statusIndex = {};

// Helper function to generate Order ID
function generateOrderId() {
    return 'ORD-' + (++orderCounter);
}

// Helper function to simulate status progression
function getOrderStatus(orderId) {
    if (!statusIndex[orderId]) {
        statusIndex[orderId] = 0;
    }
    
    // Progress through statuses every 15 seconds
    const elapsed = Date.now() - (orders.find(o => o.orderId === orderId)?.createdAt || Date.now());
    const progression = Math.floor(elapsed / 15000);
    statusIndex[orderId] = Math.min(progression, statuses.length - 1);
    
    return statuses[statusIndex[orderId]];
}

// API Routes

// 1. Create a new order
app.post('/api/orders', (req, res) => {
    const { customerName, customerPhone, restaurant, deliveryAddress, items, totalAmount } = req.body;

    // Validate input
    if (!customerName || !customerPhone || !restaurant || !deliveryAddress || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newOrder = {
        orderId: generateOrderId(),
        customerName,
        customerPhone,
        restaurant,
        deliveryAddress,
        items,
        totalAmount,
        status: 'Confirmed',
        createdAt: Date.now(),
        estimatedDelivery: new Date(Date.now() + 30 * 60000).toLocaleTimeString()
    };

    orders.push(newOrder);
    
    console.log(`✅ Order Created: ${newOrder.orderId} for ${customerName}`);

    res.json({ 
        success: true,
        orderId: newOrder.orderId,
        message: 'Order placed successfully'
    });
});

// 2. Get all orders
app.get('/api/orders', (req, res) => {
    // Update status for all orders
    const updatedOrders = orders.map(order => ({
        ...order,
        status: getOrderStatus(order.orderId)
    }));

    res.json(updatedOrders);
});

// 3. Get specific order by ID
app.get('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    let order = orders.find(o => o.orderId === orderId);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // Update status
    order.status = getOrderStatus(orderId);

    res.json(order);
});

// 4. Update order status (for admin purposes)
app.put('/api/orders/:orderId/status', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    if (!statuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    order.status = status;
    console.log(`📍 Order Status Updated: ${orderId} -> ${status}`);

    res.json({ success: true, message: 'Status updated', order });
});

// 5. Cancel an order
app.delete('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const index = orders.findIndex(o => o.orderId === orderId);

    if (index === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }

    const cancelledOrder = orders.splice(index, 1)[0];
    console.log(`❌ Order Cancelled: ${orderId}`);

    res.json({ success: true, message: 'Order cancelled', order: cancelledOrder });
});

// 6. Get delivery stats
app.get('/api/stats', (req, res) => {
    const totalOrders = orders.length;
    const delivered = orders.filter(o => getOrderStatus(o.orderId) === 'Delivered').length;
    const inProgress = orders.filter(o => getOrderStatus(o.orderId) !== 'Delivered').length;

    res.json({
        totalOrders,
        delivered,
        inProgress,
        averageValue: orders.length > 0 ? (orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length).toFixed(2) : 0
    });
});

// 7. Search orders by customer phone
app.get('/api/search/:phone', (req, res) => {
    const { phone } = req.params;
    const matchedOrders = orders.filter(o => o.customerPhone.includes(phone));

    if (matchedOrders.length === 0) {
        return res.status(404).json({ error: 'No orders found' });
    }

    res.json(matchedOrders);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  🍕 FOOD DELIVERY TRACKING SYSTEM 🍕      ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('\n');
    console.log(`✅ Server is running on: http://localhost:${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    console.log('\n');
    console.log('📝 Available API Endpoints:');
    console.log('   POST   /api/orders              - Create new order');
    console.log('   GET    /api/orders              - Get all orders');
    console.log('   GET    /api/orders/:orderId     - Get specific order');
    console.log('   PUT    /api/orders/:orderId/status - Update order status');
    console.log('   DELETE /api/orders/:orderId     - Cancel order');
    console.log('   GET    /api/stats               - Get delivery statistics');
    console.log('   GET    /api/search/:phone       - Search orders by phone');
    console.log('   GET    /api/health              - Health check');
    console.log('\n');
    console.log('💡 Open browser and navigate to: http://localhost:3000');
    console.log('⏹️  Press Ctrl+C to stop the server');
    console.log('\n');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Server shutting down...');
    process.exit(0);
});
