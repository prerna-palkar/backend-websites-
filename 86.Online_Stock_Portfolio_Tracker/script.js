const API_BASE = 'http://localhost:3000/api';
let stocksData = [];
let portfolioData = [];
let watchlistData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'stocks') loadStocks();
    if (tabName === 'portfolio') loadPortfolio();
    if (tabName === 'watchlist') loadWatchlist();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addStocks() {
    const name = document.getElementById('stocksName').value;
    const info = document.getElementById('stocksInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/stocks`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('stocksForm').reset(); toggleForm('stocksForm'); loadStocks(); updateDashboard();
}
async function loadStocks() {
    try { const res = await fetch(`${API_BASE}/stocks`); stocksData = await res.json(); renderStocks(); } catch(e) { console.error(e); }
}
function renderStocks() {
    const c = document.getElementById('stocksList');
    if (!stocksData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No stocks yet</p></div>'; return; }
    c.innerHTML = stocksData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteStocks('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteStocks(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/stocks/${id}`, {method:'DELETE'}); loadStocks(); updateDashboard(); }
}

async function addPortfolio() {
    const name = document.getElementById('portfolioName').value;
    const info = document.getElementById('portfolioInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/portfolio`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('portfolioForm').reset(); toggleForm('portfolioForm'); loadPortfolio(); updateDashboard();
}
async function loadPortfolio() {
    try { const res = await fetch(`${API_BASE}/portfolio`); portfolioData = await res.json(); renderPortfolio(); } catch(e) { console.error(e); }
}
function renderPortfolio() {
    const c = document.getElementById('portfolioList');
    if (!portfolioData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No portfolio yet</p></div>'; return; }
    c.innerHTML = portfolioData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deletePortfolio('${item.id}')">Delete</button></div></div>`).join('');
}
async function deletePortfolio(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/portfolio/${id}`, {method:'DELETE'}); loadPortfolio(); updateDashboard(); }
}

async function addWatchlist() {
    const name = document.getElementById('watchlistName').value;
    const info = document.getElementById('watchlistInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/watchlist`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('watchlistForm').reset(); toggleForm('watchlistForm'); loadWatchlist(); updateDashboard();
}
async function loadWatchlist() {
    try { const res = await fetch(`${API_BASE}/watchlist`); watchlistData = await res.json(); renderWatchlist(); } catch(e) { console.error(e); }
}
function renderWatchlist() {
    const c = document.getElementById('watchlistList');
    if (!watchlistData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No watchlist yet</p></div>'; return; }
    c.innerHTML = watchlistData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteWatchlist('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteWatchlist(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/watchlist/${id}`, {method:'DELETE'}); loadWatchlist(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('stockCount').textContent = (await (await fetch(`${API_BASE}/stocks`)).json()).length;
        document.getElementById('portfolioValue').textContent = (await (await fetch(`${API_BASE}/portfolio`)).json()).length;
        document.getElementById('gainLoss').textContent = (await (await fetch(`${API_BASE}/watchlist`)).json()).length;
    } catch(e) { console.error(e); }
}

loadStocks();
loadPortfolio();
loadWatchlist();
updateDashboard();
