const API_BASE = 'http://localhost:3000/api';
let classesData = [];
let studentsData = [];
let assignmentsData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'classes') loadClasses();
    if (tabName === 'students') loadStudents();
    if (tabName === 'assignments') loadAssignments();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addClasses() {
    const name = document.getElementById('classesName').value;
    const info = document.getElementById('classesInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/classes`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('classesForm').reset(); toggleForm('classesForm'); loadClasses(); updateDashboard();
}
async function loadClasses() {
    try { const res = await fetch(`${API_BASE}/classes`); classesData = await res.json(); renderClasses(); } catch(e) { console.error(e); }
}
function renderClasses() {
    const c = document.getElementById('classesList');
    if (!classesData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No classes yet</p></div>'; return; }
    c.innerHTML = classesData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteClasses('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteClasses(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/classes/${id}`, {method:'DELETE'}); loadClasses(); updateDashboard(); }
}

async function addStudents() {
    const name = document.getElementById('studentsName').value;
    const info = document.getElementById('studentsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/students`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('studentsForm').reset(); toggleForm('studentsForm'); loadStudents(); updateDashboard();
}
async function loadStudents() {
    try { const res = await fetch(`${API_BASE}/students`); studentsData = await res.json(); renderStudents(); } catch(e) { console.error(e); }
}
function renderStudents() {
    const c = document.getElementById('studentsList');
    if (!studentsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No students yet</p></div>'; return; }
    c.innerHTML = studentsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteStudents('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteStudents(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/students/${id}`, {method:'DELETE'}); loadStudents(); updateDashboard(); }
}

async function addAssignments() {
    const name = document.getElementById('assignmentsName').value;
    const info = document.getElementById('assignmentsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/assignments`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('assignmentsForm').reset(); toggleForm('assignmentsForm'); loadAssignments(); updateDashboard();
}
async function loadAssignments() {
    try { const res = await fetch(`${API_BASE}/assignments`); assignmentsData = await res.json(); renderAssignments(); } catch(e) { console.error(e); }
}
function renderAssignments() {
    const c = document.getElementById('assignmentsList');
    if (!assignmentsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No assignments yet</p></div>'; return; }
    c.innerHTML = assignmentsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteAssignments('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteAssignments(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/assignments/${id}`, {method:'DELETE'}); loadAssignments(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('classCount').textContent = (await (await fetch(`${API_BASE}/classes`)).json()).length;
        document.getElementById('studentCount').textContent = (await (await fetch(`${API_BASE}/students`)).json()).length;
        document.getElementById('assignmentCount').textContent = (await (await fetch(`${API_BASE}/assignments`)).json()).length;
    } catch(e) { console.error(e); }
}

loadClasses();
loadStudents();
loadAssignments();
updateDashboard();
