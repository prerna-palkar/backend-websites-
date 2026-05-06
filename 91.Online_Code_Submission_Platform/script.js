const API_BASE = 'http://localhost:3000/api';
let problemsData = [];
let submissionsData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'problems') loadProblems();
    if (tabName === 'submissions') loadSubmissions();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addProblems() {
    const name = document.getElementById('problemsName').value;
    const info = document.getElementById('problemsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/problems`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('problemsForm').reset(); toggleForm('problemsForm'); loadProblems(); updateDashboard();
}
async function loadProblems() {
    try { const res = await fetch(`${API_BASE}/problems`); problemsData = await res.json(); renderProblems(); } catch(e) { console.error(e); }
}
function renderProblems() {
    const c = document.getElementById('problemsList');
    if (!problemsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No problems yet</p></div>'; return; }
    c.innerHTML = problemsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteProblems('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteProblems(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/problems/${id}`, {method:'DELETE'}); loadProblems(); updateDashboard(); }
}

async function addSubmissions() {
    const name = document.getElementById('submissionsName').value;
    const info = document.getElementById('submissionsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/submissions`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('submissionsForm').reset(); toggleForm('submissionsForm'); loadSubmissions(); updateDashboard();
}
async function loadSubmissions() {
    try { const res = await fetch(`${API_BASE}/submissions`); submissionsData = await res.json(); renderSubmissions(); } catch(e) { console.error(e); }
}
function renderSubmissions() {
    const c = document.getElementById('submissionsList');
    if (!submissionsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No submissions yet</p></div>'; return; }
    c.innerHTML = submissionsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteSubmissions('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteSubmissions(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/submissions/${id}`, {method:'DELETE'}); loadSubmissions(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('problemCount').textContent = (await (await fetch(`${API_BASE}/problems`)).json()).length;
        document.getElementById('submissionCount').textContent = (await (await fetch(`${API_BASE}/submissions`)).json()).length;
    } catch(e) { console.error(e); }
}

loadProblems();
loadSubmissions();
updateDashboard();
