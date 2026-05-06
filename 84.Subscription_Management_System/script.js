const API_BASE = 'http://localhost:3000/api';
let plansData = [];
let subscribersData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'plans') loadPlans();
    if (tabName === 'subscribers') loadSubscribers();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addPlans() {
    const name = document.getElementById('plansName').value;
    const info = document.getElementById('plansInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/plans`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('plansForm').reset(); toggleForm('plansForm'); loadPlans(); updateDashboard();
}
async function loadPlans() {
    try { const res = await fetch(`${API_BASE}/plans`); plansData = await res.json(); renderPlans(); } catch(e) { console.error(e); }
}
function renderPlans() {
    const c = document.getElementById('plansList');
    if (!plansData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No plans yet</p></div>'; return; }
    c.innerHTML = plansData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deletePlans('${item.id}')">Delete</button></div></div>`).join('');
}
async function deletePlans(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/plans/${id}`, {method:'DELETE'}); loadPlans(); updateDashboard(); }
}

async function addSubscribers() {
    const name = document.getElementById('subscribersName').value;
    const info = document.getElementById('subscribersInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/subscribers`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('subscribersForm').reset(); toggleForm('subscribersForm'); loadSubscribers(); updateDashboard();
}
async function loadSubscribers() {
    try { const res = await fetch(`${API_BASE}/subscribers`); subscribersData = await res.json(); renderSubscribers(); } catch(e) { console.error(e); }
}
function renderSubscribers() {
    const c = document.getElementById('subscribersList');
    if (!subscribersData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No subscribers yet</p></div>'; return; }
    c.innerHTML = subscribersData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteSubscribers('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteSubscribers(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/subscribers/${id}`, {method:'DELETE'}); loadSubscribers(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('planCount').textContent = (await (await fetch(`${API_BASE}/plans`)).json()).length;
        document.getElementById('subCount').textContent = (await (await fetch(`${API_BASE}/subscribers`)).json()).length;
    } catch(e) { console.error(e); }
}

loadPlans();
loadSubscribers();
updateDashboard();
