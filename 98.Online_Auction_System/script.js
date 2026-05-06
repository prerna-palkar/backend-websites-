const API_BASE = 'http://localhost:3000/api';
let itemsData = [];
let bidsData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'items') loadItems();
    if (tabName === 'bids') loadBids();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addItems() {
    const name = document.getElementById('itemsName').value;
    const info = document.getElementById('itemsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/items`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('itemsForm').reset(); toggleForm('itemsForm'); loadItems(); updateDashboard();
}
async function loadItems() {
    try { const res = await fetch(`${API_BASE}/items`); itemsData = await res.json(); renderItems(); } catch(e) { console.error(e); }
}
function renderItems() {
    const c = document.getElementById('itemsList');
    if (!itemsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No items yet</p></div>'; return; }
    c.innerHTML = itemsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteItems('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteItems(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/items/${id}`, {method:'DELETE'}); loadItems(); updateDashboard(); }
}

async function addBids() {
    const name = document.getElementById('bidsName').value;
    const info = document.getElementById('bidsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/bids`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('bidsForm').reset(); toggleForm('bidsForm'); loadBids(); updateDashboard();
}
async function loadBids() {
    try { const res = await fetch(`${API_BASE}/bids`); bidsData = await res.json(); renderBids(); } catch(e) { console.error(e); }
}
function renderBids() {
    const c = document.getElementById('bidsList');
    if (!bidsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No bids yet</p></div>'; return; }
    c.innerHTML = bidsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteBids('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteBids(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/bids/${id}`, {method:'DELETE'}); loadBids(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('itemCount').textContent = (await (await fetch(`${API_BASE}/items`)).json()).length;
        document.getElementById('bidCount').textContent = (await (await fetch(`${API_BASE}/bids`)).json()).length;
    } catch(e) { console.error(e); }
}

loadItems();
loadBids();
updateDashboard();
