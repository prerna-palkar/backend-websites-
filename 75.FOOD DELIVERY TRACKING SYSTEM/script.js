// Storage for orders
let orders = [];
let currentOrderId = null;

// API Base URL
const API_URL = 'http://localhost:3000/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadOrders();
});

function setupEventListeners() {
    // Update price when items are selected
    document.querySelectorAll('.food-item').forEach(checkbox => {
        checkbox.addEventListener('change', updateTotalPrice);
    });
}

function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll('.food-item:checked').forEach(item => {
        total += parseInt(item.value);
    });
    document.getElementById('totalPrice').textContent = '$' + total.toFixed(2);
}

async function placeOrder() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const restaurant = document.getElementById('restaurant').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value.trim();

    // Validation
    if (!customerName || !customerPhone || !restaurant || !deliveryAddress) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    const selectedItems = [];
    let totalAmount = 0;
    document.querySelectorAll('.food-item:checked').forEach(item => {
        selectedItems.push(item.value);
        totalAmount += parseInt(item.value);
    });

    if (selectedItems.length === 0) {
        showAlert('Please select at least one item', 'error');
        return;
    }

    // Prepare order data
    const orderData = {
        customerName,
        customerPhone,
        restaurant,
        deliveryAddress,
        items: selectedItems,
        totalAmount
    };

    try {
        // Send to backend
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error('Order failed');

        const result = await response.json();
        
        showAlert(`Order placed successfully! Order ID: ${result.orderId}`, 'success');
        
        // Reset form
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('restaurant').value = '';
        document.getElementById('deliveryAddress').value = '';
        document.querySelectorAll('.food-item').forEach(item => item.checked = false);
        document.getElementById('totalPrice').textContent = '$0.00';

        // Reload orders
        loadOrders();
    } catch (error) {
        showAlert('Error placing order: ' + error.message, 'error');
    }
}

async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();
        orders = data;
        displayOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function displayOrders() {
    const ordersList = document.getElementById('activeOrders');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="empty-state">No active orders yet. Place an order to start tracking!</p>';
        return;
    }

    let html = '';
    orders.forEach(order => {
        const statusClass = order.status.toLowerCase().replace(' ', '-');
        html += `
            <div class="order-card" onclick="displayTrackingDetails('${order.orderId}')">
                <div class="order-card-header">
                    <span class="order-id">${order.orderId}</span>
                    <span class="order-status ${statusClass}">${order.status}</span>
                </div>
                <div class="order-card-details">
                    <p><strong>${order.customerName}</strong> • ${order.restaurant}</p>
                    <p>📍 ${order.deliveryAddress.substring(0, 40)}...</p>
                    <p>💵 $${order.totalAmount.toFixed(2)}</p>
                </div>
            </div>
        `;
    });

    ordersList.innerHTML = html;
}

async function searchOrder() {
    const trackingId = document.getElementById('trackingId').value.trim();
    if (!trackingId) {
        showAlert('Please enter an Order ID', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/orders/${trackingId}`);
        if (!response.ok) throw new Error('Order not found');
        
        const order = await response.json();
        currentOrderId = order.orderId;
        displayTrackingDetails(order.orderId);
    } catch (error) {
        showAlert('Order not found', 'error');
    }
}

async function displayTrackingDetails(orderId) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`);
        if (!response.ok) throw new Error('Order not found');
        
        const order = await response.json();

        document.getElementById('trackedOrderId').textContent = `Order #${order.orderId}`;
        document.getElementById('trackedCustomer').textContent = order.customerName;
        document.getElementById('trackedRestaurant').textContent = order.restaurant;
        document.getElementById('trackedAmount').textContent = '$' + order.totalAmount.toFixed(2);
        document.getElementById('trackedAddress').textContent = order.deliveryAddress;

        // Update timeline based on status
        updateTimeline(order.status);
        
        // Update status text
        updateStatusDisplay(order);

        // Show tracking details
        document.getElementById('trackingDetails').style.display = 'block';
        
        // Auto-update every 3 seconds
        setInterval(() => {
            refreshTrackingDetails(orderId);
        }, 3000);
    } catch (error) {
        showAlert('Error loading order details: ' + error.message, 'error');
    }
}

function updateTimeline(status) {
    // Reset all timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.remove('active');
    });

    // Remove confirmed class from markers
    document.querySelectorAll('.timeline-marker').forEach(marker => {
        marker.classList.remove('confirmed');
    });

    // Activate based on current status
    switch(status) {
        case 'Delivered':
            document.getElementById('status-delivered').classList.add('active');
            document.getElementById('status-delivered').querySelector('.timeline-marker').classList.add('confirmed');
        case 'Out for Delivery':
            document.getElementById('status-on-way').classList.add('active');
            document.getElementById('status-on-way').querySelector('.timeline-marker').classList.add('confirmed');
        case 'Preparing Food':
            document.getElementById('status-preparing').classList.add('active');
            document.getElementById('status-preparing').querySelector('.timeline-marker').classList.add('confirmed');
        case 'Confirmed':
            document.getElementById('status-confirmed').classList.add('active');
    }

    // Update timestamps
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (status === 'Confirmed' || status === 'Preparing Food' || status === 'Out for Delivery' || status === 'Delivered') {
        document.getElementById('time-confirmed').textContent = timeString;
    }
    if (status === 'Preparing Food' || status === 'Out for Delivery' || status === 'Delivered') {
        document.getElementById('time-preparing').textContent = timeString;
    }
    if (status === 'Out for Delivery' || status === 'Delivered') {
        document.getElementById('time-on-way').textContent = timeString;
    }
    if (status === 'Delivered') {
        document.getElementById('time-delivered').textContent = timeString;
    }
}

function updateStatusDisplay(order) {
    const statusText = document.getElementById('statusText');
    const etaText = document.getElementById('eta');
    
    let emoji = '⏳';
    let message = order.status;
    let eta = '25-30 minutes';

    if (order.status === 'Confirmed') {
        emoji = '✅';
        eta = '20-25 minutes';
    } else if (order.status === 'Preparing Food') {
        emoji = '👨‍🍳';
        eta = '15-20 minutes';
    } else if (order.status === 'Out for Delivery') {
        emoji = '🚴';
        eta = '5-10 minutes';
    } else if (order.status === 'Delivered') {
        emoji = '🎉';
        message = 'Order Delivered!';
        eta = 'Completed';
    }

    statusText.innerHTML = `${emoji} Order Status: <strong>${message}</strong>`;
    etaText.textContent = `⏱️ ETA: ${eta}`;
}

async function refreshTrackingDetails(orderId) {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`);
        if (!response.ok) return;
        
        const order = await response.json();
        updateTimeline(order.status);
        updateStatusDisplay(order);
    } catch (error) {
        console.error('Error refreshing tracking details:', error);
    }
}

function closeTracking() {
    document.getElementById('trackingDetails').style.display = 'none';
    document.getElementById('trackingId').value = '';
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.width = '400px';
    alert.style.maxWidth = '90%';
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Initial load
loadOrders();

// Auto-refresh orders every 5 seconds
setInterval(loadOrders, 5000);
