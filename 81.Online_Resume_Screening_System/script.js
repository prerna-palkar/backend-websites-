const API_BASE = 'http://localhost:3000/api';
let jobs = [], resumes = [], screenings = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    if (tabName === 'jobs') loadJobs();
    if (tabName === 'resumes') loadResumes();
    if (tabName === 'screenings') loadScreenings();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addJob() {
    const title = document.getElementById('jobTitle').value;
    const dept = document.getElementById('jobDept').value;
    const skills = document.getElementById('jobSkills').value;
    const exp = document.getElementById('jobExp').value;
    if (!title || !dept || !skills || !exp) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/jobs`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({title, dept, skills, exp}) });
    document.getElementById('jobForm').reset(); toggleForm('jobForm'); loadJobs(); updateDashboard();
}

async function loadJobs() {
    const res = await fetch(`${API_BASE}/jobs`); jobs = await res.json();
    const c = document.getElementById('jobsList');
    if (!jobs.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💼</div><p>No jobs posted yet</p></div>'; return; }
    c.innerHTML = jobs.map(j => `<div class="card"><div class="card-header"><div><div class="card-title">${j.title}</div><div class="card-subtitle">${j.dept}</div></div><span class="badge badge-primary">${j.exp}+ yrs</span></div><div class="card-detail"><span>🛠 ${j.skills}</span><button class="btn-danger" onclick="deleteJob('${j.id}')">Delete</button></div></div>`).join('');
    populateSelect('screenJob', jobs, 'title');
}

async function deleteJob(id) { if(confirm('Delete?')) { await fetch(`${API_BASE}/jobs/${id}`, {method:'DELETE'}); loadJobs(); updateDashboard(); } }

async function addResume() {
    const name = document.getElementById('candidateName').value;
    const email = document.getElementById('candidateEmail').value;
    const exp = document.getElementById('candidateExp').value;
    const skills = document.getElementById('candidateSkills').value;
    if (!name || !email || !exp || !skills) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/resumes`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, email, exp, skills}) });
    document.getElementById('resumeForm').reset(); toggleForm('resumeForm'); loadResumes(); updateDashboard();
}

async function loadResumes() {
    const res = await fetch(`${API_BASE}/resumes`); resumes = await res.json();
    const c = document.getElementById('resumesList');
    if (!resumes.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📄</div><p>No resumes added yet</p></div>'; return; }
    c.innerHTML = resumes.map(r => `<div class="card"><div class="card-header"><div><div class="card-title">${r.name}</div><div class="card-subtitle">${r.email}</div></div><span class="badge badge-success">${r.exp} yrs exp</span></div><div class="card-detail"><span>🛠 ${r.skills}</span><button class="btn-danger" onclick="deleteResume('${r.id}')">Delete</button></div></div>`).join('');
    populateSelect('screenResume', resumes, 'name');
}

async function deleteResume(id) { if(confirm('Delete?')) { await fetch(`${API_BASE}/resumes/${id}`, {method:'DELETE'}); loadResumes(); updateDashboard(); } }

async function screenResume() {
    const resumeId = document.getElementById('screenResume').value;
    const jobId = document.getElementById('screenJob').value;
    if (!resumeId || !jobId) { alert('Select both resume and job'); return; }
    await fetch(`${API_BASE}/screenings`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({resumeId, jobId}) });
    document.getElementById('screenForm').reset(); toggleForm('screenForm'); loadScreenings(); updateDashboard();
}

async function loadScreenings() {
    const res = await fetch(`${API_BASE}/screenings`); screenings = await res.json();
    const c = document.getElementById('screeningsList');
    if (!screenings.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><p>No screenings run yet</p></div>'; return; }
    c.innerHTML = screenings.map(s => {
        const resume = resumes.find(r => r.id === s.resumeId);
        const job = jobs.find(j => j.id === s.jobId);
        const badge = s.status === 'Shortlisted' ? 'badge-success' : 'badge-danger';
        return `<div class="card"><div class="card-header"><div><div class="card-title">${resume?.name||'Unknown'}</div><div class="card-subtitle">${job?.title||'Unknown'}</div></div><span class="badge ${badge}">${s.status}</span></div><div class="card-detail"><span>Score: ${s.score}/100</span></div></div>`;
    }).join('');
}

function populateSelect(id, data, labelField) {
    const sel = document.getElementById(id);
    const first = sel.options[0].outerHTML;
    sel.innerHTML = first + data.map(d => `<option value="${d.id}">${d[labelField]}</option>`).join('');
}

async function updateDashboard() {
    const [j, r, s] = await Promise.all([fetch(`${API_BASE}/jobs`), fetch(`${API_BASE}/resumes`), fetch(`${API_BASE}/screenings`)]);
    const jd = await j.json(), rd = await r.json(), sd = await s.json();
    document.getElementById('jobCount').textContent = jd.length;
    document.getElementById('resumeCount').textContent = rd.length;
    document.getElementById('shortlistedCount').textContent = sd.filter(x => x.status === 'Shortlisted').length;
    document.getElementById('rejectedCount').textContent = sd.filter(x => x.status === 'Rejected').length;
}

loadJobs(); loadResumes(); loadScreenings(); updateDashboard();
