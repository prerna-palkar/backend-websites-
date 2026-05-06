const API_BASE = 'http://localhost:3000/api';
let roomsData = [];
let bookingsData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'rooms') loadRooms();
    if (tabName === 'bookings') loadBookings();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addRooms() {
    const name = document.getElementById('roomsName').value;
    const info = document.getElementById('roomsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/rooms`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('roomsForm').reset(); toggleForm('roomsForm'); loadRooms(); updateDashboard();
}
async function loadRooms() {
    try { const res = await fetch(`${API_BASE}/rooms`); roomsData = await res.json(); renderRooms(); } catch(e) { console.error(e); }
}
function renderRooms() {
    const c = document.getElementById('roomsList');
    if (!roomsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No rooms yet</p></div>'; return; }
    c.innerHTML = roomsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteRooms('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteRooms(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/rooms/${id}`, {method:'DELETE'}); loadRooms(); updateDashboard(); }
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
        document.getElementById('roomCount').textContent = (await (await fetch(`${API_BASE}/rooms`)).json()).length;
        document.getElementById('bookingCount').textContent = (await (await fetch(`${API_BASE}/bookings`)).json()).length;
    } catch(e) { console.error(e); }
}

loadRooms();
loadBookings();
updateDashboard();
