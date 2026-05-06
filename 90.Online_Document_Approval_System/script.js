const API_BASE = 'http://localhost:3000/api';
let documentsData = [];
let approversData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'documents') loadDocuments();
    if (tabName === 'approvers') loadApprovers();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addDocuments() {
    const name = document.getElementById('documentsName').value;
    const info = document.getElementById('documentsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/documents`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('documentsForm').reset(); toggleForm('documentsForm'); loadDocuments(); updateDashboard();
}
async function loadDocuments() {
    try { const res = await fetch(`${API_BASE}/documents`); documentsData = await res.json(); renderDocuments(); } catch(e) { console.error(e); }
}
function renderDocuments() {
    const c = document.getElementById('documentsList');
    if (!documentsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No documents yet</p></div>'; return; }
    c.innerHTML = documentsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteDocuments('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteDocuments(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/documents/${id}`, {method:'DELETE'}); loadDocuments(); updateDashboard(); }
}

async function addApprovers() {
    const name = document.getElementById('approversName').value;
    const info = document.getElementById('approversInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/approvers`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('approversForm').reset(); toggleForm('approversForm'); loadApprovers(); updateDashboard();
}
async function loadApprovers() {
    try { const res = await fetch(`${API_BASE}/approvers`); approversData = await res.json(); renderApprovers(); } catch(e) { console.error(e); }
}
function renderApprovers() {
    const c = document.getElementById('approversList');
    if (!approversData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No approvers yet</p></div>'; return; }
    c.innerHTML = approversData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteApprovers('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteApprovers(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/approvers/${id}`, {method:'DELETE'}); loadApprovers(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('docCount').textContent = (await (await fetch(`${API_BASE}/documents`)).json()).length;
        document.getElementById('pendingCount').textContent = (await (await fetch(`${API_BASE}/approvers`)).json()).length;
    } catch(e) { console.error(e); }
}

loadDocuments();
loadApprovers();
updateDashboard();
