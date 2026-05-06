const API_BASE = 'http://localhost:3000/api';
let membersData = [];
let workoutsData = [];
let plansData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'members') loadMembers();
    if (tabName === 'workouts') loadWorkouts();
    if (tabName === 'plans') loadPlans();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addMembers() {
    const name = document.getElementById('membersName').value;
    const info = document.getElementById('membersInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/members`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('membersForm').reset(); toggleForm('membersForm'); loadMembers(); updateDashboard();
}
async function loadMembers() {
    try { const res = await fetch(`${API_BASE}/members`); membersData = await res.json(); renderMembers(); } catch(e) { console.error(e); }
}
function renderMembers() {
    const c = document.getElementById('membersList');
    if (!membersData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No members yet</p></div>'; return; }
    c.innerHTML = membersData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteMembers('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteMembers(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/members/${id}`, {method:'DELETE'}); loadMembers(); updateDashboard(); }
}

async function addWorkouts() {
    const name = document.getElementById('workoutsName').value;
    const info = document.getElementById('workoutsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/workouts`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('workoutsForm').reset(); toggleForm('workoutsForm'); loadWorkouts(); updateDashboard();
}
async function loadWorkouts() {
    try { const res = await fetch(`${API_BASE}/workouts`); workoutsData = await res.json(); renderWorkouts(); } catch(e) { console.error(e); }
}
function renderWorkouts() {
    const c = document.getElementById('workoutsList');
    if (!workoutsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No workouts yet</p></div>'; return; }
    c.innerHTML = workoutsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteWorkouts('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteWorkouts(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/workouts/${id}`, {method:'DELETE'}); loadWorkouts(); updateDashboard(); }
}

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

async function updateDashboard() {
    try {
        document.getElementById('memberCount').textContent = (await (await fetch(`${API_BASE}/members`)).json()).length;
        document.getElementById('workoutCount').textContent = (await (await fetch(`${API_BASE}/workouts`)).json()).length;
        document.getElementById('activePlans').textContent = (await (await fetch(`${API_BASE}/plans`)).json()).length;
    } catch(e) { console.error(e); }
}

loadMembers();
loadWorkouts();
loadPlans();
updateDashboard();
