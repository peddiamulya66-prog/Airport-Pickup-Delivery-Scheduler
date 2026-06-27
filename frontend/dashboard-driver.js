// Driver Dashboard Logic

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Verify user is logged in as driver
document.addEventListener('DOMContentLoaded', () => {
    if (!verifyRole(['driver'])) {
        return;
    }

    const user = getCurrentUser();
    document.getElementById('driverName').textContent = user.name;

    setupTabNavigation();
    loadAssignments();
    loadAvailableJobs();
});

// Tab Navigation
function setupTabNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const tabId = `${tabName}-tab`;
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    if (tabName === 'assignments') {
        loadAssignments();
    } else if (tabName === 'available') {
        loadAvailableJobs();
    } else if (tabName === 'completed') {
        loadCompleted();
    }
}

// Load Assignments
function loadAssignments() {
    const driver = getCurrentUser();
    let requests = JSON.parse(localStorage.getItem('pickupRequests')) || [];

    // Filter for current driver and active deliveries
    const assignments = requests.filter(r => r.driverId === driver.email && r.status === 'in-progress');

    document.getElementById('todayAssignments').textContent = assignments.length;

    let completed = JSON.parse(localStorage.getItem('driverCompleted')) || [];
    completed = completed.filter(c => c.driverId === driver.email);

    document.getElementById('completedToday').textContent = completed.length;
    document.getElementById('earningsToday').textContent = '$' + completed.reduce((sum, item) => sum + Number(item.earning || 0), 0);

    const tbody = document.getElementById('tableBody');

    if (assignments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No active assignments</td></tr>';
        return;
    }

    tbody.innerHTML = assignments.map(assignment => `
        <tr>
            <td><strong>${assignment.id}</strong></td>
            <td>${assignment.customerName}</td>
            <td>${assignment.pickupCity}</td>
            <td>${assignment.destination}</td>
            <td><span class="status-badge ${assignment.status}">${assignment.status}</span></td>
            <td>
                <button class="btn btn-small" onclick="viewAssignmentDetails('${assignment.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

// Load Available Jobs
function loadAvailableJobs() {
    let requests = JSON.parse(localStorage.getItem('pickupRequests')) || [];

    // Filter for unassigned requests
    requests = requests.filter(r => r.status === 'pending');

    const jobsList = document.getElementById('jobsList');

    if (requests.length === 0) {
        jobsList.innerHTML = '<p class="empty-state">No available jobs at the moment</p>';
        return;
    }

    jobsList.innerHTML = requests.map(request => `
        <div class="job-card" onclick="acceptJob('${request.id}')">
            <h4>${request.pickupCity} → ${request.destination}</h4>
            <p><strong>Customer:</strong> ${request.customerName}</p>
            <p><strong>Cargo:</strong> ${request.cargoType} (${request.quantity} items)</p>
            <p><strong>Weight:</strong> ${request.weight} kg</p>
            <p class="earning">Earning: $50</p>
            <button class="btn btn-primary" onclick="event.stopPropagation(); acceptJob('${request.id}')">Accept Job</button>
        </div>
    `).join('');
}

// Accept Job
function acceptJob(requestId) {
    const driver = getCurrentUser();
    let requests = JSON.parse(localStorage.getItem('pickupRequests')) || [];
    const request = requests.find(r => r.id === requestId);

    if (!request) {
        alert('Request not found');
        return;
    }

    if (confirm(`Accept this pickup job?\n\nCustomer: ${request.customerName}\nDestination: ${request.destination}\nEarning: $50`)) {
        request.driverId = driver.email;
        request.driverName = driver.name;
        request.assignedAt = new Date().toLocaleString();
        request.status = 'in-progress';
        request.earning = 50;
        request.timeline = request.timeline || [];
        request.timeline.push({
            status: 'in-progress',
            timestamp: new Date().toLocaleString(),
            message: `Assigned to ${driver.name}`
        });

        localStorage.setItem('pickupRequests', JSON.stringify(requests));

        alert('✓ Job accepted! Check your assignments tab.');
        switchTab('assignments');
    }
}

// View Assignment Details
function viewAssignmentDetails(requestId) {
    let requests = JSON.parse(localStorage.getItem('pickupRequests')) || [];
    const request = requests.find(r => r.id === requestId);

    if (!request) {
        alert('Assignment not found');
        return;
    }

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">Pickup ID</div>
            <div class="detail-value">${request.id}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Customer</div>
            <div class="detail-value">${request.customerName}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Pickup City</div>
            <div class="detail-value">${request.pickupCity}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Destination</div>
            <div class="detail-value">${request.destination}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Cargo Type</div>
            <div class="detail-value">${request.cargoType}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Weight</div>
            <div class="detail-value">${request.weight} kg</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Delivery Address</div>
            <div class="detail-value">${request.deliveryAddress || 'N/A'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Status</div>
            <div class="detail-value"><span class="status-badge ${request.status}">${request.status}</span></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Assigned At</div>
            <div class="detail-value">${request.assignedAt || 'Not assigned'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Earning</div>
            <div class="detail-value" style="color: #28a745; font-weight: 600; font-size: 1.2em;">$${request.earning || 0}</div>
        </div>
        ${request.otpRequested ? `
        <div class="detail-row" style="background: #fff3cd; padding: 10px; border-radius: 6px;">
            <div class="detail-label">OTP Status</div>
            <div class="detail-value"><strong style="color: #856404;">Waiting for customer OTP</strong></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">OTP Sent to Customer</div>
            <div class="detail-value">${request.otpRequestedAt || 'N/A'}</div>
        </div>
        ` : ''}
        <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" onclick="requestCompletion('${request.id}')">Request Completion (OTP)</button>
    `;

    openModal();
}

// Request completion - generate OTP and send to customer
function requestCompletion(requestId) {
    let requests = JSON.parse(localStorage.getItem('pickupRequests')) || [];
    const request = requests.find(r => r.id === requestId);

    if (!request) {
        alert('Request not found');
        return;
    }

    if (request.otpRequested) {
        alert('✓ OTP already sent to customer. Waiting for verification...');
        return;
    }

    const otp = generateOTP();
    request.otp = otp;
    request.otpRequested = true;
    request.otpRequestedAt = new Date().toLocaleString();
    request.timeline = request.timeline || [];
    request.timeline.push({
        status: 'otp-requested',
        timestamp: new Date().toLocaleString(),
        message: `OTP sent to customer for delivery verification`
    });

    localStorage.setItem('pickupRequests', JSON.stringify(requests));

    alert(`✓ OTP Generated!\n\nOTP: ${otp}\n\nThis OTP has been sent to the customer.\nWait for them to verify it.`);
    viewAssignmentDetails(requestId);
}


// Load Completed
function loadCompleted() {
    const driver = getCurrentUser();
    let completed = JSON.parse(localStorage.getItem('driverCompleted')) || [];

    completed = completed.filter(c => c.driverId === driver.email);

    const tbody = document.getElementById('completedBody');

    if (completed.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No completed pickups yet</td></tr>';
        return;
    }

    tbody.innerHTML = completed.map(comp => `
        <tr>
            <td><strong>${comp.pickupId}</strong></td>
            <td>${comp.customerName}</td>
            <td>${comp.destination}</td>
            <td>${comp.completedAt}</td>
            <td><strong style="color: #28a745;">$${comp.earning}</strong></td>
        </tr>
    `).join('');
}

// Filter jobs
function applyFilters() {
    loadAvailableJobs();
}

// Modal functions
function openModal() {
    document.getElementById('pickupModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('pickupModal').classList.add('hidden');
}

// Helper functions
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function verifyRole(allowedRoles) {
    const user = getCurrentUser();
    if (!user || !allowedRoles.includes(user.role)) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}
