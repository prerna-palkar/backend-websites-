const API_BASE = 'http://localhost:3000/api';
let propertiesData = [];
let agentsData = [];
let inquiriesData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'properties') loadProperties();
    if (tabName === 'agents') loadAgents();
    if (tabName === 'inquiries') loadInquiries();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addProperties() {
    const name = document.getElementById('propertiesName').value;
    const info = document.getElementById('propertiesInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/properties`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('propertiesForm').reset(); toggleForm('propertiesForm'); loadProperties(); updateDashboard();
}
async function loadProperties() {
    try { const res = await fetch(`${API_BASE}/properties`); propertiesData = await res.json(); renderProperties(); } catch(e) { console.error(e); }
}
function renderProperties() {
    const c = document.getElementById('propertiesList');
    if (!propertiesData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No properties yet</p></div>'; return; }
    c.innerHTML = propertiesData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteProperties('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteProperties(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/properties/${id}`, {method:'DELETE'}); loadProperties(); updateDashboard(); }
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

async function addInquiries() {
    const name = document.getElementById('inquiriesName').value;
    const info = document.getElementById('inquiriesInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/inquiries`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('inquiriesForm').reset(); toggleForm('inquiriesForm'); loadInquiries(); updateDashboard();
}
async function loadInquiries() {
    try { const res = await fetch(`${API_BASE}/inquiries`); inquiriesData = await res.json(); renderInquiries(); } catch(e) { console.error(e); }
}
function renderInquiries() {
    const c = document.getElementById('inquiriesList');
    if (!inquiriesData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No inquiries yet</p></div>'; return; }
    c.innerHTML = inquiriesData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteInquiries('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteInquiries(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/inquiries/${id}`, {method:'DELETE'}); loadInquiries(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('propertyCount').textContent = (await (await fetch(`${API_BASE}/properties`)).json()).length;
        document.getElementById('agentCount').textContent = (await (await fetch(`${API_BASE}/agents`)).json()).length;
        document.getElementById('inquiryCount').textContent = (await (await fetch(`${API_BASE}/inquiries`)).json()).length;
    } catch(e) { console.error(e); }
}

loadProperties();
loadAgents();
loadInquiries();
updateDashboard();
