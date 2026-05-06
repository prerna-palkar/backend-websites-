const API_BASE = 'http://localhost:3000/api';
let surveysData = [];
let responsesData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'surveys') loadSurveys();
    if (tabName === 'responses') loadResponses();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addSurveys() {
    const name = document.getElementById('surveysName').value;
    const info = document.getElementById('surveysInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/surveys`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('surveysForm').reset(); toggleForm('surveysForm'); loadSurveys(); updateDashboard();
}
async function loadSurveys() {
    try { const res = await fetch(`${API_BASE}/surveys`); surveysData = await res.json(); renderSurveys(); } catch(e) { console.error(e); }
}
function renderSurveys() {
    const c = document.getElementById('surveysList');
    if (!surveysData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No surveys yet</p></div>'; return; }
    c.innerHTML = surveysData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteSurveys('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteSurveys(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/surveys/${id}`, {method:'DELETE'}); loadSurveys(); updateDashboard(); }
}

async function addResponses() {
    const name = document.getElementById('responsesName').value;
    const info = document.getElementById('responsesInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/responses`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('responsesForm').reset(); toggleForm('responsesForm'); loadResponses(); updateDashboard();
}
async function loadResponses() {
    try { const res = await fetch(`${API_BASE}/responses`); responsesData = await res.json(); renderResponses(); } catch(e) { console.error(e); }
}
function renderResponses() {
    const c = document.getElementById('responsesList');
    if (!responsesData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No responses yet</p></div>'; return; }
    c.innerHTML = responsesData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteResponses('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteResponses(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/responses/${id}`, {method:'DELETE'}); loadResponses(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('surveyCount').textContent = (await (await fetch(`${API_BASE}/surveys`)).json()).length;
        document.getElementById('responseCount').textContent = (await (await fetch(`${API_BASE}/responses`)).json()).length;
    } catch(e) { console.error(e); }
}

loadSurveys();
loadResponses();
updateDashboard();
