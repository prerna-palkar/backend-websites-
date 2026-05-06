let tickets = [];
let filteredTickets = [];

const ticketForm = document.getElementById('ticketForm');
const ticketsContainer = document.getElementById('ticketsContainer');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const ticketModal = document.getElementById('ticketModal');
const modalBody = document.getElementById('modalBody');
const closeButtons = document.querySelectorAll('.close-btn, .close-modal');

const API_URL = 'http://localhost:3000/api';

async function fetchTickets() {
    try {
        const response = await fetch(`${API_URL}/tickets`);
        if (response.ok) {
            tickets = await response.json();
            updateStats();
            filterAndDisplayTickets();
        }
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
}

async function createTicket(formData) {
    try {
        const response = await fetch(`${API_URL}/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            const newTicket = await response.json();
            tickets.unshift(newTicket);
            updateStats();
            filterAndDisplayTickets();
            ticketForm.reset();
            showNotification('Ticket created successfully!', 'success');
        }
    } catch (error) {
        console.error('Error creating ticket:', error);
        showNotification('Error creating ticket', 'error');
    }
}

async function updateTicket(id, updateData) {
    try {
        const response = await fetch(`${API_URL}/tickets/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        if (response.ok) {
            await fetchTickets();
            closeModal();
            showNotification('Ticket updated successfully!', 'success');
        }
    } catch (error) {
        console.error('Error updating ticket:', error);
        showNotification('Error updating ticket', 'error');
    }
}

async function deleteTicket(id) {
    if (confirm('Are you sure you want to delete this ticket?')) {
        try {
            const response = await fetch(`${API_URL}/tickets/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await fetchTickets();
                closeModal();
                showNotification('Ticket deleted successfully!', 'success');
            }
        } catch (error) {
            console.error('Error deleting ticket:', error);
            showNotification('Error deleting ticket', 'error');
        }
    }
}

function updateStats() {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'Open').length;
    const resolved = tickets.filter(t => t.status === 'Resolved').length;

    document.getElementById('totalTickets').textContent = total;
    document.getElementById('openTickets').textContent = open;
    document.getElementById('resolvedTickets').textContent = resolved;
}

function filterAndDisplayTickets() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = filterStatus.value;

    filteredTickets = tickets.filter(ticket => {
        const matchesSearch = 
            ticket.subject.toLowerCase().includes(searchTerm) ||
            ticket.name.toLowerCase().includes(searchTerm) ||
            ticket.email.toLowerCase().includes(searchTerm) ||
            ticket.id.toLowerCase().includes(searchTerm);

        const matchesStatus = !statusFilter || ticket.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    displayTickets();
}

function displayTickets() {
    if (filteredTickets.length === 0) {
        ticketsContainer.innerHTML = '<div class="empty-state">📭 No tickets found. Try adjusting your filters.</div>';
        return;
    }

    ticketsContainer.innerHTML = filteredTickets.map(ticket => `
        <div class="ticket-card ${ticket.priority.toLowerCase()}" onclick="openTicketDetail('${ticket.id}')">
            <div class="ticket-id">Ticket #${ticket.id}</div>
            <h3>${escapeHtml(ticket.subject)}</h3>
            <p>${escapeHtml(ticket.description)}</p>
            <div class="ticket-meta">
                <span class="ticket-category">${ticket.category}</span>
                <span class="ticket-status status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}">${ticket.status}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="ticket-date">${formatDate(ticket.createdAt)}</span>
                <span style="background: ${getPriorityColor(ticket.priority)}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8em; font-weight: 600;">${ticket.priority}</span>
            </div>
        </div>
    `).join('');
}

function openTicketDetail(id) {
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;

    modalBody.innerHTML = `
        <div class="ticket-detail">
            <h3>${escapeHtml(ticket.subject)}</h3>
            <div class="detail-row">
                <span class="detail-label">Ticket ID:</span>
                <span class="detail-value">#${ticket.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${escapeHtml(ticket.name)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${escapeHtml(ticket.email)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Category:</span>
                <span class="detail-value">${ticket.category}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Priority:</span>
                <span class="detail-value">${ticket.priority}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">${ticket.status}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Created:</span>
                <span class="detail-value">${formatDate(ticket.createdAt)}</span>
            </div>
            <div>
                <span class="detail-label">Description:</span>
                <p style="margin-top: 8px; color: #333;">${escapeHtml(ticket.description)}</p>
            </div>

            <div class="update-form">
                <h4 style="color: #667eea; margin-bottom: 15px;">Update Ticket</h4>
                <div class="form-group-inline">
                    <label>Status</label>
                    <select id="updateStatus" value="${ticket.status}">
                        <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
                        <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
                    </select>
                </div>
                <div class="form-group-inline">
                    <label>Priority</label>
                    <select id="updatePriority" value="${ticket.priority}">
                        <option value="Low" ${ticket.priority === 'Low' ? 'selected' : ''}>Low</option>
                        <option value="Medium" ${ticket.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                        <option value="High" ${ticket.priority === 'High' ? 'selected' : ''}>High</option>
                        <option value="Critical" ${ticket.priority === 'Critical' ? 'selected' : ''}>Critical</option>
                    </select>
                </div>
                <div class="form-group-inline">
                    <label>Notes</label>
                    <textarea id="updateNotes" placeholder="Add notes or updates..." style="resize: vertical; min-height: 80px;">${ticket.notes || ''}</textarea>
                </div>
            </div>
        </div>
    `;

    const modalFooter = ticketModal.querySelector('.modal-footer');
    modalFooter.innerHTML = `
        <button class="btn-delete" onclick="deleteTicket('${ticket.id}')">Delete</button>
        <button class="btn-update" onclick="handleUpdateTicket('${ticket.id}')">Update</button>
        <button class="btn-secondary close-modal">Close</button>
    `;

    openModal();
}

function handleUpdateTicket(id) {
    const status = document.getElementById('updateStatus').value;
    const priority = document.getElementById('updatePriority').value;
    const notes = document.getElementById('updateNotes').value;

    updateTicket(id, { status, priority, notes });
}

function openModal() {
    ticketModal.classList.remove('hidden');
}

function closeModal() {
    ticketModal.classList.add('hidden');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function getPriorityColor(priority) {
    const colors = {
        'Low': '#48bb78',
        'Medium': '#f6ad55',
        'High': '#f56565',
        'Critical': '#c53030'
    };
    return colors[priority] || '#667eea';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

ticketForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        category: document.getElementById('category').value,
        priority: document.getElementById('priority').value,
        description: document.getElementById('description').value
    };
    createTicket(formData);
});

searchInput.addEventListener('input', filterAndDisplayTickets);
filterStatus.addEventListener('change', filterAndDisplayTickets);

closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
});

ticketModal.addEventListener('click', (e) => {
    if (e.target === ticketModal) {
        closeModal();
    }
});

fetchTickets();
setInterval(fetchTickets, 5000);
