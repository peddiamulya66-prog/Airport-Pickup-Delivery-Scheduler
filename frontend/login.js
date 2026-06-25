// Login and Authentication Logic

// Demo users database (in production, this would be backend)
const DEMO_USERS = {
    'customer@orbem.com': {
        password: 'pass123',
        role: 'customer',
        name: 'John Doe'
    },
    'driver@orbem.com': {
        password: 'pass123',
        role: 'driver',
        name: 'Raj Kumar'
    },
    'admin@orbem.com': {
        password: 'pass123',
        role: 'admin',
        name: 'Admin User'
    }
};

// Local storage key for persisted users
const STORAGE_USERS_KEY = 'appUsers';

// Load persisted users into DEMO_USERS (keeps demos if no stored users)
function loadUsers() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || 'null');
        if (stored && typeof stored === 'object') {
            // merge stored users into DEMO_USERS (stored overrides defaults)
            Object.keys(stored).forEach(email => {
                DEMO_USERS[email] = stored[email];
            });
        } else {
            // initialize storage with default demo users
            localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEMO_USERS));
        }
    } catch (err) {
        console.error('Failed to load users from storage', err);
    }
}

function saveUser(email, userObj) {
    try {
        const users = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '{}');
        users[email] = userObj;
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (err) {
        console.error('Failed to save user', err);
    }
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    // load persisted users first so signup/logins survive refresh
    loadUsers();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        redirectToDashboard(user.role);
    }
    
    setupLoginForm();
    setupSignupForm();
});

// Setup login form
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    const errorDiv = document.getElementById('loginError');
    const successDiv = document.getElementById('loginSuccess');
    
    // Clear previous messages
    errorDiv.classList.remove('show');
    successDiv.classList.remove('show');
    
    // Validate
    if (!username || !password) {
        showError('Please enter username and password', errorDiv);
        return;
    }
    
    // Check credentials (demo only - in production use backend API)
    const user = DEMO_USERS[username];
    
    if (!user || user.password !== password) {
        showError('Invalid username or password', errorDiv);
        return;
    }
    
    // Login successful
    const userData = {
        email: username,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString(),
        remember: remember
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    showSuccess('Login successful! Redirecting...', successDiv);
    
    // Redirect after 1 second
    setTimeout(() => {
        redirectToDashboard(user.role);
    }, 1000);
}

// Setup signup form
function setupSignupForm() {
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', handleSignup);
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const role = document.querySelector('input[name="signup-role"]:checked').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    
    const errorDiv = document.getElementById('signupError');
    errorDiv.classList.remove('show');
    
    // Validation
    if (!name || !email || !phone || !password || !confirm) {
        showError('Please fill all fields', errorDiv);
        return;
    }
    
    if (password !== confirm) {
        showError('Passwords do not match', errorDiv);
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters', errorDiv);
        return;
    }
    
    if (!email.includes('@')) {
        showError('Please enter a valid email', errorDiv);
        return;
    }
    
    if (DEMO_USERS[email]) {
        showError('This email is already registered', errorDiv);
        return;
    }
    
    // In production, send to backend
    // For demo, just add to local storage
    const newUser = {
        email: email,
        name: name,
        phone: phone,
        password: password,
        role: role,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage (demo)
    DEMO_USERS[email] = {
        password: password,
        role: role,
        name: name
    };
    // persist the new user so it remains after refresh
    saveUser(email, {
        password: password,
        role: role,
        name: name
    });
    
    alert('✓ Account created successfully!\n\nYou can now login with your email and password.');
    toggleSignup();
    
    // Populate login form
    document.getElementById('username').value = email;
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
}

// Toggle between login and signup
function toggleSignup() {
    const loginCard = document.querySelector('.login-card');
    const signupCard = document.getElementById('signupCard');
    
    loginCard.classList.toggle('hidden');
    signupCard.classList.toggle('hidden');
    
    // Clear forms and messages
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
    document.getElementById('loginError').classList.remove('show');
    document.getElementById('signupError').classList.remove('show');
}

// Show error message
function showError(message, element) {
    element.textContent = message;
    element.classList.add('show');
}

// Show success message
function showSuccess(message, element) {
    element.textContent = message;
    element.classList.add('show');
}

// Redirect to appropriate dashboard
function redirectToDashboard(role) {
    if (role === 'customer') {
        window.location.href = 'dashboard-customer.html';
    } else if (role === 'driver') {
        window.location.href = 'dashboard-driver.html';
    } else if (role === 'admin') {
        window.location.href = 'index.html'; // Admin gets main dashboard
    }
}

// Logout function (call from other pages)
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Check if user is logged in (for other pages)
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Verify user role (for protecting pages)
function verifyRole(allowedRoles) {
    const user = getCurrentUser();
    if (!user || !allowedRoles.includes(user.role)) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Keep users in sync across browser tabs
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_USERS_KEY) {
        loadUsers();
    }
});
