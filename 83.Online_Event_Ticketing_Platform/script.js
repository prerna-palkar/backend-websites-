const API_BASE = 'http://localhost:3000/api';
let eventsData = [];
let bookingsData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'events') loadEvents();
    if (tabName === 'bookings') loadBookings();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addEvents() {
    const name = document.getElementById('eventsName').value;
    const info = document.getElementById('eventsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/events`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('eventsForm').reset(); toggleForm('eventsForm'); loadEvents(); updateDashboard();
}
async function loadEvents() {
    try { const res = await fetch(`${API_BASE}/events`); eventsData = await res.json(); renderEvents(); } catch(e) { console.error(e); }
}
function renderEvents() {
    const c = document.getElementById('eventsList');
    if (!eventsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No events yet</p></div>'; return; }
    c.innerHTML = eventsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteEvents('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteEvents(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/events/${id}`, {method:'DELETE'}); loadEvents(); updateDashboard(); }
}

async function addBookings() {
    const name = document.getElementById('bookingsName').value;
    const info = document.getElementById('bookingsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/bookings`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('bookingsForm').reset(); toggleForm('bookingsForm'); loadBookings(); updateDashboard();
}
async function loadBookings() {
    try { const res = await fetch(`${API_BASE}/bookings`); bookingsData = await res.json(); renderBookings(); } catch(e) { console.error(e); }
}
function renderBookings() {
    const c = document.getElementById('bookingsList');
    if (!bookingsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No bookings yet</p></div>'; return; }
    c.innerHTML = bookingsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteBookings('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteBookings(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/bookings/${id}`, {method:'DELETE'}); loadBookings(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('eventCount').textContent = (await (await fetch(`${API_BASE}/events`)).json()).length;
        document.getElementById('ticketCount').textContent = (await (await fetch(`${API_BASE}/bookings`)).json()).length;
    } catch(e) { console.error(e); }
}

loadEvents();
loadBookings();
updateDashboard();
