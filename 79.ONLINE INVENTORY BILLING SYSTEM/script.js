let inventory = [];
let cart = [];
let invoices = [];
let currentProductId = 1;
let currentInvoiceNumber = 1;

const sampleProducts = [
    { id: 1, name: 'Laptop Pro 15', category: 'Electronics', price: 1299.99, stock: 15 },
    { id: 2, name: 'Wireless Mouse', category: 'Electronics', price: 29.99, stock: 50 },
    { id: 3, name: 'USB-C Cable', category: 'Electronics', price: 15.99, stock: 100 },
    { id: 4, name: 'Designer T-Shirt', category: 'Clothing', price: 49.99, stock: 25 },
    { id: 5, name: 'Denim Jeans', category: 'Clothing', price: 79.99, stock: 30 },
    { id: 6, name: 'Coffee Beans', category: 'Food', price: 12.99, stock: 60 },
    { id: 7, name: 'Python Programming', category: 'Books', price: 45.99, stock: 20 },
    { id: 8, name: 'JavaScript Guide', category: 'Books', price: 39.99, stock: 35 }
];

document.addEventListener('DOMContentLoaded', function() {
    inventory = [...sampleProducts];
    currentProductId = Math.max(...inventory.map(p => p.id)) + 1;
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab(this.getAttribute('href').substring(1));
        });
    });

    loadInventory();
    loadBillingPage();
    updateReports();
});

function switchTab(tabName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`a[href="#${tabName}"]`).classList.add('active');
}

function loadInventory() {
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';

    let filteredProducts = inventory;
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
    }
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }

    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        let statusClass = 'status-in-stock';
        let statusText = 'In Stock';
        
        if (product.stock === 0) {
            statusClass = 'status-out-of-stock';
            statusText = 'Out of Stock';
        } else if (product.stock < 10) {
            statusClass = 'status-low-stock';
            statusText = 'Low Stock';
        }

        row.innerHTML = `
            <td>PRD-${product.id.toString().padStart(4, '0')}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-small btn-edit" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-small btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openAddProductModal() {
    document.getElementById('productModal').classList.add('active');
}

function closeAddProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productForm').reset();
}

function addProduct(event) {
    event.preventDefault();
    
    const newProduct = {
        id: currentProductId++,
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value)
    };

    inventory.push(newProduct);
    closeAddProductModal();
    loadInventory();
    loadBillingPage();
    updateReports();
}

function editProduct(productId) {
    const product = inventory.find(p => p.id === productId);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        
        openAddProductModal();
        
        const form = document.getElementById('productForm');
        const oldSubmit = form.onsubmit;
        form.onsubmit = function(event) {
            event.preventDefault();
            product.name = document.getElementById('productName').value;
            product.category = document.getElementById('productCategory').value;
            product.price = parseFloat(document.getElementById('productPrice').value);
            product.stock = parseInt(document.getElementById('productStock').value);
            
            closeAddProductModal();
            loadInventory();
            loadBillingPage();
            updateReports();
            form.onsubmit = oldSubmit;
        };
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        inventory = inventory.filter(p => p.id !== productId);
        loadInventory();
        loadBillingPage();
        updateReports();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchInput) searchInput.addEventListener('input', loadInventory);
    if (categoryFilter) categoryFilter.addEventListener('change', loadInventory);
});

function loadBillingPage() {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;
    
    productsList.innerHTML = '';
    inventory.forEach(product => {
        if (product.stock > 0) {
            const productDiv = document.createElement('div');
            productDiv.className = 'product-item';
            productDiv.innerHTML = `
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                </div>
                <button class="btn-add-to-cart" onclick="addToCart(${product.id})">Add</button>
            `;
            productsList.appendChild(productDiv);
        }
    });
}

function addToCart(productId) {
    const product = inventory.find(p => p.id === productId);
    if (!product || product.stock === 0) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            alert('Cannot add more than available stock');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Cart is empty</p>';
        document.getElementById('subtotal').textContent = '$0.00';
        document.getElementById('tax').textContent = '$0.00';
        document.getElementById('total').textContent = '$0.00';
        return;
    }

    let html = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-qty">Qty: ${item.quantity}</div>
                </div>
                <div>
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
    });

    cartItemsDiv.innerHTML = html;

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
}

function clearCart() {
    if (confirm('Clear the cart?')) {
        cart = [];
        updateCart();
    }
}

function generateInvoice() {
    if (cart.length === 0) {
        alert('Cart is empty. Please add items to generate an invoice.');
        return;
    }

    const invoiceNumber = currentInvoiceNumber++;
    let invoiceHTML = `
        <div style="font-family: Arial, sans-serif;">
            <h2>Invoice #${invoiceNumber.toString().padStart(4, '0')}</h2>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${document.getElementById('paymentMethod').value}</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr style="background: #f0f0f0;">
                        <th style="padding: 10px; text-align: left;">Product</th>
                        <th style="padding: 10px; text-align: center;">Quantity</th>
                        <th style="padding: 10px; text-align: right;">Price</th>
                        <th style="padding: 10px; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
    `;

    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        invoiceHTML += `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px;">${item.name}</td>
                <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right;">$${item.price.toFixed(2)}</td>
                <td style="padding: 10px; text-align: right;">$${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    invoiceHTML += `
                </tbody>
            </table>
            <div style="margin-top: 20px; text-align: right;">
                <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                <p><strong>Tax (10%):</strong> $${tax.toFixed(2)}</p>
                <p style="font-size: 18px; font-weight: bold; color: #667eea;"><strong>Total: $${total.toFixed(2)}</strong></p>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #999;">Thank you for your purchase!</p>
        </div>
    `;

    invoices.push({
        number: invoiceNumber,
        items: [...cart],
        subtotal: subtotal,
        tax: tax,
        total: total,
        paymentMethod: document.getElementById('paymentMethod').value,
        date: new Date().toLocaleDateString()
    });

    document.getElementById('invoiceContent').innerHTML = invoiceHTML;
    document.getElementById('invoiceModal').classList.add('active');

    cart = [];
    updateCart();
    updateReports();
}

function closeInvoiceModal() {
    document.getElementById('invoiceModal').classList.remove('active');
}

function printInvoice() {
    const invoiceContent = document.getElementById('invoiceContent').innerHTML;
    const printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>Invoice</title></head><body>');
    printWindow.document.write(invoiceContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function updateReports() {
    const totalProducts = inventory.length;
    const lowStockItems = inventory.filter(p => p.stock < 10 && p.stock > 0).length;
    const totalValue = inventory.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalTransactions = invoices.length;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockItems').textContent = lowStockItems;
    document.getElementById('totalValue').textContent = '$' + totalValue.toFixed(2);
    document.getElementById('totalTransactions').textContent = totalTransactions;
}
