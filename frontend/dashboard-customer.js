// Customer Dashboard Logic

// Verify user is logged in as customer
document.addEventListener('DOMContentLoaded', () => {
    if (!verifyRole(['customer'])) {
        return;
    }

    const user = getCurrentUser();
    document.getElementById('userName').textContent = user.name;

    setupTabNavigation();
    setupFormListener();
    displayShipments();
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

    if (tabName === 'dashboard') {
        displayShipments();
    }
}

// Form Setup
function setupFormListener() {
    const form = document.getElementById('shipmentForm');
    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const user = getCurrentUser();
    const shipmentData = {
        id: 'REQ-' + Date.now(),
        customerId: user.email,
        customerName: user.name,
        pickupCity: document.getElementById('pickupCity').value,
        destination: document.getElementById('destination').value,
        cargoType: document.getElementById('cargoType').value,
        weight: document.getElementById('weight').value,
        quantity: document.getElementById('quantity').value,
        deliveryAddress: document.getElementById('deliveryAddress').value,
        notes: document.getElementById('description').value,
        status: 'pending',
        createdAt: new Date().toLocaleString(),
        driverId: null,
        driverName: 'Not assigned',
        assignedAt: null,
        earning: 0,
        timeline: [
            {
                status: 'pending',
                timestamp: new Date().toLocaleString(),
                message: 'Order placed by customer'
            }
        ]
    };

    saveShipment(shipmentData);
}

function saveShipment(data) {
    let requests = JSON.parse(localStorage.getItem('pickupRequests')) || [];
    requests.push(data);
    localStorage.setItem('pickupRequests', JSON.stringify(requests));

    const statusDiv = document.getElementById('formStatus');
    statusDiv.textContent = '✓ Order created successfully!';
    statusDiv.className = 'status-message success';

    document.getElementById('shipmentForm').reset();

    setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status-message';
        switchTab('dashboard');
    }, 2000);
}

// Display Shipments
function displayShipments() {
    const user = getCurrentUser();
    let requests = JSON.parse(localStorage.getItem('pickupRequests')) || [];
    
    // Filter for current customer
    const shipments = requests.filter(r => r.customerId === user.email);

    updateStats(shipments);
    updateTable(shipments);
}

function updateStats(shipments) {
    const total = shipments.length;
    const inTransit = shipments.filter(s => s.status === 'in-progress').length;
    const delivered = shipments.filter(s => s.status === 'delivered').length;

    document.getElementById('totalShipments').textContent = total;
    document.getElementById('inTransitShipments').textContent = inTransit;
    document.getElementById('deliveredShipments').textContent = delivered;
}

function updateTable(shipments) {
    const tbody = document.getElementById('tableBody');

    if (shipments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No shipments yet. Create one to get started!</td></tr>';
        return;
    }

    tbody.innerHTML = shipments.map(shipment => `
        <tr>
            <td><strong>${shipment.id}</strong></td>
            <td>${shipment.destination}</td>
            <td><span class="status-badge ${shipment.status}">${shipment.status}</span></td>
            <td>${shipment.driverName || 'Not assigned'}</td>
            <td>${shipment.createdAt}</td>
            <td><button class="btn btn-small" onclick="viewShipmentTracking('${shipment.id}')">Track</button></td>
        </tr>
    `).join('');
}

// Track Shipment
function trackShipment() {
    const trackingId = document.getElementById('trackingId').value.trim();
    
    if (!trackingId) {
        alert('Please enter a Shipment ID');
        return;
    }

    let requests = JSON.parse(localStorage.getItem('pickupRequests')) || [];
    const request = requests.find(s => s.id === trackingId);

    if (!request) {
        document.getElementById('trackingResult').innerHTML = '<p style="color: red;">Order not found</p>';
        return;
    }

    viewShipmentTracking(trackingId);
}

function viewShipmentTracking(shipmentId) {
    let requests = JSON.parse(localStorage.getItem('pickupRequests')) || [];
    const shipment = requests.find(s => s.id === shipmentId);

    if (!shipment) {
        alert('Shipment not found');
        return;
    }

    const result = document.getElementById('trackingResult');
    
    let timelineHtml = '<div class="tracking-timeline">';
    shipment.timeline.forEach(item => {
        timelineHtml += `
            <div class="timeline-item">
                <div class="timeline-dot">📍</div>
                <div class="timeline-content">
                    <h4>${item.status.toUpperCase()}</h4>
                    <p>${item.message}</p>
                    <small>${item.timestamp}</small>
                </div>
            </div>
        `;
    });
    timelineHtml += '</div>';

    let otpHtml = '';
    if (shipment.otpRequested && !shipment.otpVerified) {
        otpHtml = `
        <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #0c5460;">
            <h4 style="color: #0c5460; margin-top: 0;">✓ Partner is Ready for Delivery</h4>
            <p style="color: #0c5460; margin: 10px 0;">Your delivery partner has reached and is ready to complete the delivery.</p>
            <p style="color: #0c5460;"><strong>Enter the OTP provided by your delivery partner to confirm delivery:</strong></p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <input type="text" id="otpInput" placeholder="Enter 6-digit OTP" maxlength="6" style="flex: 1; padding: 10px; border: 2px solid #0c5460; border-radius: 6px; font-size: 1.1em; letter-spacing: 2px;">
                <button class="btn btn-primary" onclick="verifyOTP('${shipmentId}')" style="width: auto;">Verify OTP</button>
            </div>
            <div id="otpError" style="color: #721c24; background: #f8d7da; padding: 10px; border-radius: 6px; margin-top: 10px; display: none;"></div>
        </div>
        `;
    } else if (shipment.otpVerified) {
        otpHtml = `
        <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #155724;">
            <h4 style="color: #155724; margin-top: 0;">✓ Delivery Completed</h4>
            <p style="color: #155724;">Your order has been successfully delivered on ${shipment.deliveredAt}</p>
        </div>
        `;
    }

    result.innerHTML = `
        <h3>Order Details: ${shipment.id}</h3>
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Pickup City:</strong> ${shipment.pickupCity}</p>
            <p><strong>Destination:</strong> ${shipment.destination}</p>
            <p><strong>Delivery Address:</strong> ${shipment.deliveryAddress || 'Not provided'}</p>
            <p><strong>Cargo Type:</strong> ${shipment.cargoType}</p>
            <p><strong>Weight:</strong> ${shipment.weight} kg</p>
            <p><strong>Quantity:</strong> ${shipment.quantity}</p>
            <p><strong>Delivery Partner:</strong> ${shipment.driverName || 'Not assigned yet'}</p>
            <p><strong>Status:</strong> <span class="status-badge ${shipment.status}">${shipment.status}</span></p>
        </div>
        ${otpHtml}
        <h4>Tracking Timeline:</h4>
        ${timelineHtml}
    `;

    switchTab('tracking');
}

function verifyOTP(shipmentId) {
    const otpInput = document.getElementById('otpInput').value.trim();
    
    if (!otpInput) {
        showOtpError('Please enter OTP', shipmentId);
        return;
    }

    if (otpInput.length !== 6) {
        showOtpError('OTP must be 6 digits', shipmentId);
        return;
    }

    let requests = JSON.parse(localStorage.getItem('pickupRequests')) || [];
    const shipment = requests.find(s => s.id === shipmentId);

    if (!shipment) {
        showOtpError('Order not found', shipmentId);
        return;
    }

    if (otpInput === shipment.otp) {
        // OTP verified
        const driver = shipment.driverId || 'System';
        shipment.otpVerified = true;
        shipment.status = 'delivered';
        shipment.deliveredAt = new Date().toLocaleString();
        shipment.timeline = shipment.timeline || [];
        shipment.timeline.push({
            status: 'delivered',
            timestamp: new Date().toLocaleString(),
            message: `Delivered by ${shipment.driverName} (OTP verified)`
        });

        localStorage.setItem('pickupRequests', JSON.stringify(requests));

        // Add to driver's completed list
        let completedStore = JSON.parse(localStorage.getItem('driverCompleted')) || [];
        completedStore.push({
            requestId: shipment.id,
            driverId: shipment.driverId,
            driverName: shipment.driverName,
            customerName: shipment.customerName,
            destination: shipment.destination,
            completedAt: shipment.deliveredAt,
            earning: shipment.earning || 0
        });
        localStorage.setItem('driverCompleted', JSON.stringify(completedStore));

        alert('✓ OTP Verified! Delivery marked as completed.');
        viewShipmentTracking(shipmentId);
    } else {
        showOtpError('Invalid OTP. Please try again.', shipmentId);
    }
}

function showOtpError(message, shipmentId) {
    const errorDiv = document.getElementById('otpError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// Helper functions from login.js
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
