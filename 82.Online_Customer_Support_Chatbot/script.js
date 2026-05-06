const API_BASE = 'http://localhost:3000/api';
let ticketsData = [];
let agentsData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'tickets') loadTickets();
    if (tabName === 'agents') loadAgents();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addTickets() {
    const name = document.getElementById('ticketsName').value;
    const info = document.getElementById('ticketsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/tickets`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('ticketsForm').reset(); toggleForm('ticketsForm'); loadTickets(); updateDashboard();
}
async function loadTickets() {
    try { const res = await fetch(`${API_BASE}/tickets`); ticketsData = await res.json(); renderTickets(); } catch(e) { console.error(e); }
}
function renderTickets() {
    const c = document.getElementById('ticketsList');
    if (!ticketsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No tickets yet</p></div>'; return; }
    c.innerHTML = ticketsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteTickets('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteTickets(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/tickets/${id}`, {method:'DELETE'}); loadTickets(); updateDashboard(); }
}

async function addAgents() {
    const name = document.getElementById('agentsName').value;
    const info = document.getElementById('agentsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/agents`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('agentsForm').reset(); toggleForm('agentsForm'); loadAgents(); updateDashboard();
}
async function loadAgents() {
    try { const res = await fetch(`${API_BASE}/agents`); agentsData = await res.json(); renderAgents(); } catch(e) { console.error(e); }
}
function renderAgents() {
    const c = document.getElementById('agentsList');
    if (!agentsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No agents yet</p></div>'; return; }
    c.innerHTML = agentsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteAgents('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteAgents(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/agents/${id}`, {method:'DELETE'}); loadAgents(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('ticketCount').textContent = (await (await fetch(`${API_BASE}/tickets`)).json()).length;
        document.getElementById('openCount').textContent = (await (await fetch(`${API_BASE}/agents`)).json()).length;
    } catch(e) { console.error(e); }
}

loadTickets();
loadAgents();
updateDashboard();
