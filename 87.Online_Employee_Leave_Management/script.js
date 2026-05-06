const API_BASE = 'http://localhost:3000/api';
let employeesData = [];
let leavesData = [];
let holidaysData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'employees') loadEmployees();
    if (tabName === 'leaves') loadLeaves();
    if (tabName === 'holidays') loadHolidays();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addEmployees() {
    const name = document.getElementById('employeesName').value;
    const info = document.getElementById('employeesInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/employees`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('employeesForm').reset(); toggleForm('employeesForm'); loadEmployees(); updateDashboard();
}
async function loadEmployees() {
    try { const res = await fetch(`${API_BASE}/employees`); employeesData = await res.json(); renderEmployees(); } catch(e) { console.error(e); }
}
function renderEmployees() {
    const c = document.getElementById('employeesList');
    if (!employeesData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No employees yet</p></div>'; return; }
    c.innerHTML = employeesData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteEmployees('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteEmployees(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/employees/${id}`, {method:'DELETE'}); loadEmployees(); updateDashboard(); }
}

async function addLeaves() {
    const name = document.getElementById('leavesName').value;
    const info = document.getElementById('leavesInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/leaves`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('leavesForm').reset(); toggleForm('leavesForm'); loadLeaves(); updateDashboard();
}
async function loadLeaves() {
    try { const res = await fetch(`${API_BASE}/leaves`); leavesData = await res.json(); renderLeaves(); } catch(e) { console.error(e); }
}
function renderLeaves() {
    const c = document.getElementById('leavesList');
    if (!leavesData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No leave requests yet</p></div>'; return; }
    c.innerHTML = leavesData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteLeaves('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteLeaves(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/leaves/${id}`, {method:'DELETE'}); loadLeaves(); updateDashboard(); }
}

async function addHolidays() {
    const name = document.getElementById('holidaysName').value;
    const info = document.getElementById('holidaysInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/holidays`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('holidaysForm').reset(); toggleForm('holidaysForm'); loadHolidays(); updateDashboard();
}
async function loadHolidays() {
    try { const res = await fetch(`${API_BASE}/holidays`); holidaysData = await res.json(); renderHolidays(); } catch(e) { console.error(e); }
}
function renderHolidays() {
    const c = document.getElementById('holidaysList');
    if (!holidaysData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No holidays yet</p></div>'; return; }
    c.innerHTML = holidaysData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteHolidays('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteHolidays(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/holidays/${id}`, {method:'DELETE'}); loadHolidays(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('empCount').textContent = (await (await fetch(`${API_BASE}/employees`)).json()).length;
        document.getElementById('pendingCount').textContent = (await (await fetch(`${API_BASE}/leaves`)).json()).length;
        document.getElementById('approvedCount').textContent = (await (await fetch(`${API_BASE}/holidays`)).json()).length;
    } catch(e) { console.error(e); }
}

loadEmployees();
loadLeaves();
loadHolidays();
updateDashboard();
