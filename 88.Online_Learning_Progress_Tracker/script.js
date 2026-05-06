const API_BASE = 'http://localhost:3000/api';
let coursesData = [];
let studentsData = [];
let progressData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'courses') loadCourses();
    if (tabName === 'students') loadStudents();
    if (tabName === 'progress') loadProgress();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addCourses() {
    const name = document.getElementById('coursesName').value;
    const info = document.getElementById('coursesInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/courses`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('coursesForm').reset(); toggleForm('coursesForm'); loadCourses(); updateDashboard();
}
async function loadCourses() {
    try { const res = await fetch(`${API_BASE}/courses`); coursesData = await res.json(); renderCourses(); } catch(e) { console.error(e); }
}
function renderCourses() {
    const c = document.getElementById('coursesList');
    if (!coursesData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No courses yet</p></div>'; return; }
    c.innerHTML = coursesData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteCourses('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteCourses(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/courses/${id}`, {method:'DELETE'}); loadCourses(); updateDashboard(); }
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

async function addProgress() {
    const name = document.getElementById('progressName').value;
    const info = document.getElementById('progressInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/progress`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('progressForm').reset(); toggleForm('progressForm'); loadProgress(); updateDashboard();
}
async function loadProgress() {
    try { const res = await fetch(`${API_BASE}/progress`); progressData = await res.json(); renderProgress(); } catch(e) { console.error(e); }
}
function renderProgress() {
    const c = document.getElementById('progressList');
    if (!progressData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No progress yet</p></div>'; return; }
    c.innerHTML = progressData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteProgress('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteProgress(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/progress/${id}`, {method:'DELETE'}); loadProgress(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('courseCount').textContent = (await (await fetch(`${API_BASE}/courses`)).json()).length;
        document.getElementById('studentCount').textContent = (await (await fetch(`${API_BASE}/students`)).json()).length;
        document.getElementById('completedCount').textContent = (await (await fetch(`${API_BASE}/progress`)).json()).length;
    } catch(e) { console.error(e); }
}

loadCourses();
loadStudents();
loadProgress();
updateDashboard();
