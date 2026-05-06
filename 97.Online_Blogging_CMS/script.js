const API_BASE = 'http://localhost:3000/api';
let postsData = [];
let authorsData = [];
let categoriesData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'posts') loadPosts();
    if (tabName === 'authors') loadAuthors();
    if (tabName === 'categories') loadCategories();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addPosts() {
    const name = document.getElementById('postsName').value;
    const info = document.getElementById('postsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/posts`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('postsForm').reset(); toggleForm('postsForm'); loadPosts(); updateDashboard();
}
async function loadPosts() {
    try { const res = await fetch(`${API_BASE}/posts`); postsData = await res.json(); renderPosts(); } catch(e) { console.error(e); }
}
function renderPosts() {
    const c = document.getElementById('postsList');
    if (!postsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No posts yet</p></div>'; return; }
    c.innerHTML = postsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deletePosts('${item.id}')">Delete</button></div></div>`).join('');
}
async function deletePosts(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/posts/${id}`, {method:'DELETE'}); loadPosts(); updateDashboard(); }
}

async function addAuthors() {
    const name = document.getElementById('authorsName').value;
    const info = document.getElementById('authorsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/authors`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('authorsForm').reset(); toggleForm('authorsForm'); loadAuthors(); updateDashboard();
}
async function loadAuthors() {
    try { const res = await fetch(`${API_BASE}/authors`); authorsData = await res.json(); renderAuthors(); } catch(e) { console.error(e); }
}
function renderAuthors() {
    const c = document.getElementById('authorsList');
    if (!authorsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No authors yet</p></div>'; return; }
    c.innerHTML = authorsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteAuthors('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteAuthors(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/authors/${id}`, {method:'DELETE'}); loadAuthors(); updateDashboard(); }
}

async function addCategories() {
    const name = document.getElementById('categoriesName').value;
    const info = document.getElementById('categoriesInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/categories`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('categoriesForm').reset(); toggleForm('categoriesForm'); loadCategories(); updateDashboard();
}
async function loadCategories() {
    try { const res = await fetch(`${API_BASE}/categories`); categoriesData = await res.json(); renderCategories(); } catch(e) { console.error(e); }
}
function renderCategories() {
    const c = document.getElementById('categoriesList');
    if (!categoriesData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No categories yet</p></div>'; return; }
    c.innerHTML = categoriesData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteCategories('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteCategories(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/categories/${id}`, {method:'DELETE'}); loadCategories(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('postCount').textContent = (await (await fetch(`${API_BASE}/posts`)).json()).length;
        document.getElementById('authorCount').textContent = (await (await fetch(`${API_BASE}/authors`)).json()).length;
        document.getElementById('publishedCount').textContent = (await (await fetch(`${API_BASE}/categories`)).json()).length;
    } catch(e) { console.error(e); }
}

loadPosts();
loadAuthors();
loadCategories();
updateDashboard();
