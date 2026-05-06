const API_BASE = 'http://localhost:3000/api';
let destinationsData = [];
let bookingsData = [];
let travelersData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'destinations') loadDestinations();
    if (tabName === 'bookings') loadBookings();
    if (tabName === 'travelers') loadTravelers();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addDestinations() {
    const name = document.getElementById('destinationsName').value;
    const info = document.getElementById('destinationsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/destinations`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('destinationsForm').reset(); toggleForm('destinationsForm'); loadDestinations(); updateDashboard();
}
async function loadDestinations() {
    try { const res = await fetch(`${API_BASE}/destinations`); destinationsData = await res.json(); renderDestinations(); } catch(e) { console.error(e); }
}
function renderDestinations() {
    const c = document.getElementById('destinationsList');
    if (!destinationsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No destinations yet</p></div>'; return; }
    c.innerHTML = destinationsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteDestinations('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteDestinations(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/destinations/${id}`, {method:'DELETE'}); loadDestinations(); updateDashboard(); }
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

async function addTravelers() {
    const name = document.getElementById('travelersName').value;
    const info = document.getElementById('travelersInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/travelers`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('travelersForm').reset(); toggleForm('travelersForm'); loadTravelers(); updateDashboard();
}
async function loadTravelers() {
    try { const res = await fetch(`${API_BASE}/travelers`); travelersData = await res.json(); renderTravelers(); } catch(e) { console.error(e); }
}
function renderTravelers() {
    const c = document.getElementById('travelersList');
    if (!travelersData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No travelers yet</p></div>'; return; }
    c.innerHTML = travelersData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteTravelers('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteTravelers(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/travelers/${id}`, {method:'DELETE'}); loadTravelers(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('destCount').textContent = (await (await fetch(`${API_BASE}/destinations`)).json()).length;
        document.getElementById('bookingCount').textContent = (await (await fetch(`${API_BASE}/bookings`)).json()).length;
        document.getElementById('travelerCount').textContent = (await (await fetch(`${API_BASE}/travelers`)).json()).length;
    } catch(e) { console.error(e); }
}

loadDestinations();
loadBookings();
loadTravelers();
updateDashboard();
