const API_URL = 'http://localhost:3000/api';
let currentUser = null;
let allInterviews = [];
let currentFilterStatus = 'all';

function switchTab(tabName) {
    document.querySelectorAll('.auth-form').forEach(el => el.classList.remove('active-tab'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active-tab');
    event.target.classList.add('active');
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 3000);
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);
        
        showMessage('Account created successfully! Please login.', 'success');
        setTimeout(() => switchTab('login'), 2000);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);
        
        currentUser = data.user;
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        document.getElementById('userName').textContent = currentUser.name;
        
        loadStats();
        loadInterviews();
        showSection('overview');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('user');
    
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(sectionName + 'Section').classList.add('active');
    event.target.classList.add('active');

    if (sectionName === 'calendar') {
        generateCalendar();
    }
}

async function handleScheduleInterview(e) {
    e.preventDefault();

    const candidateName = document.getElementById('candidateName').value;
    const candidateEmail = document.getElementById('candidateEmail').value;
    const position = document.getElementById('position').value;
    const interviewer = document.getElementById('interviewer').value;
    const dateTime = document.getElementById('dateTime').value;
    const duration = document.getElementById('duration').value;

    try {
        const response = await fetch(`${API_URL}/schedule-interview`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                candidateName,
                candidateEmail,
                position,
                interviewer,
                dateTime,
                duration
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        showMessage('Interview scheduled successfully!', 'success');
        e.target.reset();
        loadInterviews();
        loadStats();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();

        document.getElementById('totalInterviews').textContent = stats.totalInterviews;
        document.getElementById('scheduledCount').textContent = stats.scheduledInterviews;
        document.getElementById('completedCount').textContent = stats.completedInterviews;
        document.getElementById('cancelledCount').textContent = stats.cancelledInterviews;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadInterviews() {
    try {
        const response = await fetch(`${API_URL}/all-interviews`);
        const data = await response.json();
        
        allInterviews = data.interviews.filter(i => i.userId === currentUser.id);
        
        displayUpcomingInterviews();
        displayAllInterviews();
    } catch (error) {
        console.error('Error loading interviews:', error);
    }
}

function displayUpcomingInterviews() {
    const upcoming = allInterviews
        .filter(i => i.status === 'scheduled')
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
        .slice(0, 3);

    const container = document.getElementById('upcomingList');
    
    if (upcoming.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No upcoming interviews</p>';
        return;
    }

    container.innerHTML = upcoming.map(interview => `
        <div class="interview-item">
            <div class="interview-header">
                <div class="interview-title">${interview.candidateName}</div>
                <div class="interview-badge badge-scheduled">Scheduled</div>
            </div>
            <div class="interview-details">
                <div><strong>Position:</strong> ${interview.position}</div>
                <div><strong>Date & Time:</strong> ${new Date(interview.dateTime).toLocaleString()}</div>
                <div><strong>Duration:</strong> ${interview.duration} minutes</div>
                <div><strong>Email:</strong> ${interview.candidateEmail}</div>
                <div><strong>Meeting Link:</strong> <a href="${interview.meetingLink}" target="_blank" style="color: #667eea;">Join</a></div>
            </div>
        </div>
    `).join('');
}

function displayAllInterviews() {
    let filtered = allInterviews;
    
    if (currentFilterStatus !== 'all') {
        filtered = allInterviews.filter(i => i.status === currentFilterStatus);
    }

    const container = document.getElementById('interviewsList');
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No interviews found</p>';
        return;
    }

    container.innerHTML = filtered.map(interview => `
        <div class="interview-card">
            <div class="interview-card-header">
                <div class="interview-card-title">${interview.candidateName}</div>
                <div class="interview-badge badge-${interview.status}">${interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}</div>
            </div>
            <div class="interview-card-content">
                <div class="info-item">
                    <span class="info-label">Position</span>
                    <span>${interview.position}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Interviewer</span>
                    <span>${interview.interviewer}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span>${interview.candidateEmail}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Duration</span>
                    <span>${interview.duration} minutes</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date & Time</span>
                    <span>${new Date(interview.dateTime).toLocaleString()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Meeting Link</span>
                    <a href="${interview.meetingLink}" target="_blank" style="color: #667eea;">Join Meeting</a>
                </div>
            </div>
            <div class="interview-actions">
                ${interview.status === 'scheduled' ? `
                    <button class="btn-small btn-reschedule" onclick="rescheduleInterview('${interview.id}')">Reschedule</button>
                    <button class="btn-small btn-cancel" onclick="cancelInterview('${interview.id}')">Cancel</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function filterInterviews(status) {
    currentFilterStatus = status;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    displayAllInterviews();
}

async function rescheduleInterview(interviewId) {
    const newDateTime = prompt('Enter new date and time (YYYY-MM-DDTHH:MM):');
    if (!newDateTime) return;

    try {
        const response = await fetch(`${API_URL}/reschedule-interview`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interviewId, newDateTime })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        showMessage('Interview rescheduled successfully!', 'success');
        loadInterviews();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function cancelInterview(interviewId) {
    if (!confirm('Are you sure you want to cancel this interview?')) return;

    try {
        const response = await fetch(`${API_URL}/interview/${interviewId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'cancelled' })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        showMessage('Interview cancelled successfully!', 'success');
        loadInterviews();
        loadStats();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function generateCalendar() {
    const container = document.getElementById('calendar');
    const today = new Date();
    
    container.innerHTML = '';

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day';
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = '700';
        dayHeader.style.color = '#667eea';
        dayHeader.style.cursor = 'default';
        container.appendChild(dayHeader);
    });

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        container.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;

        if (day === today.getDate()) {
            dayDiv.classList.add('today');
        }

        const interviewCount = allInterviews.filter(i => {
            const iDate = new Date(i.dateTime);
            return iDate.getDate() === day && iDate.getMonth() === today.getMonth();
        }).length;

        if (interviewCount > 0) {
            dayDiv.innerHTML += `<span style="position: absolute; font-size: 10px; background: #667eea; color: white; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; bottom: -5px; right: -5px;">${interviewCount}</span>`;
            dayDiv.style.position = 'relative';
        }

        container.appendChild(dayDiv);
    }
}

window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        document.getElementById('userName').textContent = currentUser.name;
        loadStats();
        loadInterviews();
        showSection('overview');
    }
});
