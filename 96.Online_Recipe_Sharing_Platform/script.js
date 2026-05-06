const API_BASE = 'http://localhost:3000/api';
let recipesData = [];
let chefsData = [];
let categoriesData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'recipes') loadRecipes();
    if (tabName === 'chefs') loadChefs();
    if (tabName === 'categories') loadCategories();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addRecipes() {
    const name = document.getElementById('recipesName').value;
    const info = document.getElementById('recipesInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/recipes`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('recipesForm').reset(); toggleForm('recipesForm'); loadRecipes(); updateDashboard();
}
async function loadRecipes() {
    try { const res = await fetch(`${API_BASE}/recipes`); recipesData = await res.json(); renderRecipes(); } catch(e) { console.error(e); }
}
function renderRecipes() {
    const c = document.getElementById('recipesList');
    if (!recipesData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No recipes yet</p></div>'; return; }
    c.innerHTML = recipesData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteRecipes('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteRecipes(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/recipes/${id}`, {method:'DELETE'}); loadRecipes(); updateDashboard(); }
}

async function addChefs() {
    const name = document.getElementById('chefsName').value;
    const info = document.getElementById('chefsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/chefs`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('chefsForm').reset(); toggleForm('chefsForm'); loadChefs(); updateDashboard();
}
async function loadChefs() {
    try { const res = await fetch(`${API_BASE}/chefs`); chefsData = await res.json(); renderChefs(); } catch(e) { console.error(e); }
}
function renderChefs() {
    const c = document.getElementById('chefsList');
    if (!chefsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No chefs yet</p></div>'; return; }
    c.innerHTML = chefsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteChefs('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteChefs(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/chefs/${id}`, {method:'DELETE'}); loadChefs(); updateDashboard(); }
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
        document.getElementById('recipeCount').textContent = (await (await fetch(`${API_BASE}/recipes`)).json()).length;
        document.getElementById('chefCount').textContent = (await (await fetch(`${API_BASE}/chefs`)).json()).length;
        document.getElementById('categoryCount').textContent = (await (await fetch(`${API_BASE}/categories`)).json()).length;
    } catch(e) { console.error(e); }
}

loadRecipes();
loadChefs();
loadCategories();
updateDashboard();
