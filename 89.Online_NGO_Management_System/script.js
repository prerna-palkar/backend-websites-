const API_BASE = 'http://localhost:3000/api';
let projectsData = [];
let volunteersData = [];
let donationsData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'projects') loadProjects();
    if (tabName === 'volunteers') loadVolunteers();
    if (tabName === 'donations') loadDonations();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addProjects() {
    const name = document.getElementById('projectsName').value;
    const info = document.getElementById('projectsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/projects`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('projectsForm').reset(); toggleForm('projectsForm'); loadProjects(); updateDashboard();
}
async function loadProjects() {
    try { const res = await fetch(`${API_BASE}/projects`); projectsData = await res.json(); renderProjects(); } catch(e) { console.error(e); }
}
function renderProjects() {
    const c = document.getElementById('projectsList');
    if (!projectsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No projects yet</p></div>'; return; }
    c.innerHTML = projectsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteProjects('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteProjects(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/projects/${id}`, {method:'DELETE'}); loadProjects(); updateDashboard(); }
}

async function addVolunteers() {
    const name = document.getElementById('volunteersName').value;
    const info = document.getElementById('volunteersInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/volunteers`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('volunteersForm').reset(); toggleForm('volunteersForm'); loadVolunteers(); updateDashboard();
}
async function loadVolunteers() {
    try { const res = await fetch(`${API_BASE}/volunteers`); volunteersData = await res.json(); renderVolunteers(); } catch(e) { console.error(e); }
}
function renderVolunteers() {
    const c = document.getElementById('volunteersList');
    if (!volunteersData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No volunteers yet</p></div>'; return; }
    c.innerHTML = volunteersData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteVolunteers('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteVolunteers(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/volunteers/${id}`, {method:'DELETE'}); loadVolunteers(); updateDashboard(); }
}

async function addDonations() {
    const name = document.getElementById('donationsName').value;
    const info = document.getElementById('donationsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/donations`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('donationsForm').reset(); toggleForm('donationsForm'); loadDonations(); updateDashboard();
}
async function loadDonations() {
    try { const res = await fetch(`${API_BASE}/donations`); donationsData = await res.json(); renderDonations(); } catch(e) { console.error(e); }
}
function renderDonations() {
    const c = document.getElementById('donationsList');
    if (!donationsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No donations yet</p></div>'; return; }
    c.innerHTML = donationsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteDonations('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteDonations(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/donations/${id}`, {method:'DELETE'}); loadDonations(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('projectCount').textContent = (await (await fetch(`${API_BASE}/projects`)).json()).length;
        document.getElementById('volunteerCount').textContent = (await (await fetch(`${API_BASE}/volunteers`)).json()).length;
        document.getElementById('donationCount').textContent = (await (await fetch(`${API_BASE}/donations`)).json()).length;
    } catch(e) { console.error(e); }
}

loadProjects();
loadVolunteers();
loadDonations();
updateDashboard();
