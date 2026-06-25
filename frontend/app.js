// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Store requests in memory (will connect to backend later)
let requestsStore = JSON.parse(localStorage.getItem('pickupRequests')) || [];
let selectedRequestId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupTabNavigation();
    setupFormListener();
    displayDashboard();
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
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const tabId = `${tabName}-tab`;
    document.getElementById(tabId).classList.add('active');

    // Add active class to corresponding nav button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Refresh content if needed
    if (tabName === 'dashboard') {
        displayDashboard();
    }
}

// Form Submission
function setupFormListener() {
    const form = document.getElementById('pickupForm');
    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        id: 'REQ-' + Date.now(),
        customerName: document.getElementById('customerName').value,
        originAirport: document.getElementById('originAirport').value,
        destinationAirport: document.getElementById('destinationAirport').value,
        pickupCity: document.getElementById('pickupCity').value,
        deliveryAddress: document.getElementById('deliveryAddress').value,
        cargoType: document.getElementById('cargoType').value,
        packageCount: document.getElementById('packageCount').value,
        actualWeight: document.getElementById('actualWeight').value,
        dimensions: document.getElementById('dimensions').value,
        notes: document.getElementById('notes').value,
        status: 'pending',
        date: new Date().toLocaleString(),
        owner: 'System'
    };

    // Send to backend (when ready) or store locally
    saveRequest(formData);
}

function saveRequest(data) {
    requestsStore.push(data);
    localStorage.setItem('pickupRequests', JSON.stringify(requestsStore));

    // Show success message
    const statusDiv = document.getElementById('formStatus');
    statusDiv.textContent = '✓ Request submitted successfully!';
    statusDiv.className = 'status-message success';

    // Reset form
    document.getElementById('pickupForm').reset();

    // Clear message after 3 seconds
    setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status-message';
    }, 3000);
}

// Dashboard Display
function displayDashboard() {
    updateStats();
    updateTable();
}

function updateStats() {
    const totalRequests = requestsStore.length;
    const pendingRequests = requestsStore.filter(r => r.status === 'pending').length;
    const inTransitRequests = requestsStore.filter(r => r.status === 'in-progress').length;
    const completedRequests = requestsStore.filter(r => r.status === 'completed').length;

    document.getElementById('totalRequests').textContent = totalRequests;
    document.getElementById('pendingRequests').textContent = pendingRequests;
    document.getElementById('inTransitRequests').textContent = inTransitRequests;
    document.getElementById('completedRequests').textContent = completedRequests;
}

function updateTable() {
    const tbody = document.getElementById('tableBody');

    if (requestsStore.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No requests yet. Create one to get started!</td></tr>';
        return;
    }

    tbody.innerHTML = requestsStore.map(request => `
        <tr>
            <td>#${request.id}</td>
            <td>${request.customerName}</td>
            <td>${request.pickupCity || request.originAirport} → ${request.destination || request.destinationAirport}</td>
            <td>${request.cargoType}</td>
            <td>${request.driverName || 'Not assigned'}</td>
            <td><span class="status-badge ${request.status}">${request.status}</span></td>
            <td>${request.date}</td>
            <td><button class="btn btn-small" onclick="viewDetails('${request.id}')">View</button></td>
        </tr>
    `).join('');

    renderDriverPerformance();
}

function renderDriverPerformance() {
    const driverStats = {};

    requestsStore.forEach(request => {
        if (!request.driverId) return;

        if (!driverStats[request.driverId]) {
            driverStats[request.driverId] = {
                driverName: request.driverName || request.driverId,
                active: 0,
                completed: 0,
                earnings: 0
            };
        }

        if (request.status === 'in-progress') {
            driverStats[request.driverId].active += 1;
        }

        if (request.status === 'completed') {
            driverStats[request.driverId].completed += 1;
            driverStats[request.driverId].earnings += Number(request.earning || 50);
        }
    });

    const driversBody = document.getElementById('driversBody');
    const drivers = Object.values(driverStats);

    if (drivers.length === 0) {
        driversBody.innerHTML = '<tr><td colspan="4" class="empty-state">No driver activity yet.</td></tr>';
        return;
    }

    driversBody.innerHTML = drivers.map(driver => `
        <tr>
            <td>${driver.driverName}</td>
            <td>${driver.active}</td>
            <td>${driver.completed}</td>
            <td><strong>$${driver.earnings}</strong></td>
        </tr>
    `).join('');
}

// Details View
function viewDetails(requestId) {
    const request = requestsStore.find(r => r.id === requestId);

    if (!request) {
        console.error('Request not found');
        return;
    }

    selectedRequestId = requestId;
    const detailsContent = document.getElementById('detailsContent');

    detailsContent.innerHTML = `
        <div class="details-content">
            <div class="detail-row">
                <div class="detail-label">Request ID</div>
                <div class="detail-value">#${request.id}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Customer</div>
                <div class="detail-value">${request.customerName}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Route</div>
                <div class="detail-value">${request.pickupCity || request.originAirport} → ${request.destination || request.destinationAirport}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Delivery Partner</div>
                <div class="detail-value">${request.driverName || 'Not assigned yet'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Pickup City</div>
                <div class="detail-value">${request.pickupCity}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Delivery Address</div>
                <div class="detail-value">${request.deliveryAddress}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Cargo Type</div>
                <div class="detail-value">${request.cargoType}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Package Count</div>
                <div class="detail-value">${request.packageCount}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Weight</div>
                <div class="detail-value">${request.actualWeight} kg</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Dimensions</div>
                <div class="detail-value">${request.dimensions || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status-badge ${request.status}">${request.status}</span></div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Date Created</div>
                <div class="detail-value">${request.date}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Owner</div>
                <div class="detail-value">${request.owner}</div>
            </div>
            ${request.notes ? `
            <div class="detail-row">
                <div class="detail-label">Notes</div>
                <div class="detail-value">${request.notes}</div>
            </div>
            ` : ''}
            ${request.otpRequested ? `
            <div class="detail-row" style="background: #d1ecf1; padding: 10px; border-radius: 6px;">
                <div class="detail-label">OTP Status</div>
                <div class="detail-value">
                    ${request.otpVerified ?
                `<span style="color: #155724; font-weight: 600;">✓ Verified on ${request.deliveredAt}</span>` :
                `<span style="color: #856404; font-weight: 600;">⏳ Waiting for customer verification</span>`
            }
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">OTP Requested At</div>
                <div class="detail-value">${request.otpRequestedAt}</div>
            </div>
            ` : ''}
        </div>
        <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button class="btn btn-primary" onclick="updateRequestStatus(${requestId}, 'in-progress')">Mark In Progress</button>
            <button class="btn btn-primary" onclick="updateRequestStatus(${requestId}, 'completed')">Mark Completed</button>
            <button class="btn btn-secondary" onclick="deleteRequest(${requestId})">Delete</button>
        </div>
    `;

    switchTab('details');
}

function updateRequestStatus(requestId, newStatus) {
    const request = requestsStore.find(r => r.id === requestId);
    if (request) {
        request.status = newStatus;
        localStorage.setItem('pickupRequests', JSON.stringify(requestsStore));
        viewDetails(requestId); // Refresh details
    }
}

function deleteRequest(requestId) {
    if (confirm('Are you sure you want to delete this request?')) {
        requestsStore = requestsStore.filter(r => r.id !== requestId);
        localStorage.setItem('pickupRequests', JSON.stringify(requestsStore));
        switchTab('dashboard');
    }
}
