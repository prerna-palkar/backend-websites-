const API_BASE = 'http://localhost:3000/api';
let songsData = [];
let playlistsData = [];
let artistsData = [];

document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => { e.preventDefault(); switchTab(tab.dataset.tab); });
});

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[data-tab]').forEach(l => l.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector('[data-tab="' + tabName + '"]').classList.add('active');
    if (tabName === 'songs') loadSongs();
    if (tabName === 'playlists') loadPlaylists();
    if (tabName === 'artists') loadArtists();
}

function toggleForm(id) { const f = document.getElementById(id); f.style.display = f.style.display === 'none' ? 'block' : 'none'; }

async function addSongs() {
    const name = document.getElementById('songsName').value;
    const info = document.getElementById('songsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/songs`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('songsForm').reset(); toggleForm('songsForm'); loadSongs(); updateDashboard();
}
async function loadSongs() {
    try { const res = await fetch(`${API_BASE}/songs`); songsData = await res.json(); renderSongs(); } catch(e) { console.error(e); }
}
function renderSongs() {
    const c = document.getElementById('songsList');
    if (!songsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No songs yet</p></div>'; return; }
    c.innerHTML = songsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteSongs('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteSongs(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/songs/${id}`, {method:'DELETE'}); loadSongs(); updateDashboard(); }
}

async function addPlaylists() {
    const name = document.getElementById('playlistsName').value;
    const info = document.getElementById('playlistsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/playlists`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('playlistsForm').reset(); toggleForm('playlistsForm'); loadPlaylists(); updateDashboard();
}
async function loadPlaylists() {
    try { const res = await fetch(`${API_BASE}/playlists`); playlistsData = await res.json(); renderPlaylists(); } catch(e) { console.error(e); }
}
function renderPlaylists() {
    const c = document.getElementById('playlistsList');
    if (!playlistsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No playlists yet</p></div>'; return; }
    c.innerHTML = playlistsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deletePlaylists('${item.id}')">Delete</button></div></div>`).join('');
}
async function deletePlaylists(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/playlists/${id}`, {method:'DELETE'}); loadPlaylists(); updateDashboard(); }
}

async function addArtists() {
    const name = document.getElementById('artistsName').value;
    const info = document.getElementById('artistsInfo').value;
    if (!name || !info) { alert('Fill all fields'); return; }
    await fetch(`${API_BASE}/artists`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name, info}) });
    document.getElementById('artistsForm').reset(); toggleForm('artistsForm'); loadArtists(); updateDashboard();
}
async function loadArtists() {
    try { const res = await fetch(`${API_BASE}/artists`); artistsData = await res.json(); renderArtists(); } catch(e) { console.error(e); }
}
function renderArtists() {
    const c = document.getElementById('artistsList');
    if (!artistsData.length) { c.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No artists yet</p></div>'; return; }
    c.innerHTML = artistsData.map(item => `<div class="card"><div class="card-header"><div><div class="card-title">${item.name||item.title||item.id}</div><div class="card-subtitle">${item.info||item.email||item.dept||''}</div></div><span class="badge badge-primary">Active</span></div><div class="card-detail"><span></span><button class="btn-danger" onclick="deleteArtists('${item.id}')">Delete</button></div></div>`).join('');
}
async function deleteArtists(id) {
    if(confirm('Delete?')) { await fetch(`${API_BASE}/artists/${id}`, {method:'DELETE'}); loadArtists(); updateDashboard(); }
}

async function updateDashboard() {
    try {
        document.getElementById('songCount').textContent = (await (await fetch(`${API_BASE}/songs`)).json()).length;
        document.getElementById('playlistCount').textContent = (await (await fetch(`${API_BASE}/playlists`)).json()).length;
        document.getElementById('artistCount').textContent = (await (await fetch(`${API_BASE}/artists`)).json()).length;
    } catch(e) { console.error(e); }
}

loadSongs();
loadPlaylists();
loadArtists();
updateDashboard();
