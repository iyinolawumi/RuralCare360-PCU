/* ===================================
   RuralCare360 - Main JavaScript
   =================================== */

// ===== CONFIGURATION =====
const API_BASE_URL = 'https://ruralcare360-pcu.onrender.com/api';

// ===== UTILITY FUNCTIONS =====
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-notification message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#43A047' : '#E53935'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^0[789][01]\d{8}$/.test(phone);
}

function setAuthToken(token)    { localStorage.setItem('authToken', token); }
function getAuthToken()         { return localStorage.getItem('authToken'); }
function removeAuthToken()      { localStorage.removeItem('authToken'); }
function setUserType(type)      { localStorage.setItem('userType', type); }
function getUserType()          { return localStorage.getItem('userType'); }
function setUserData(userData)  { localStorage.setItem('userData', JSON.stringify(userData)); }
function getUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
}

function logout() {
    removeAuthToken();
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
}

function requireAuth(allowedRoles = []) {
    const token = getAuthToken();
    const user  = getUserData();
    if (!token || !user) {
        window.location.href = 'index.html';
        return false;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// ===== API REQUEST =====
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    const token = getAuthToken();
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (data)  options.body = JSON.stringify(data);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result   = await response.json();
    if (!response.ok) throw new Error(result.message || 'Request failed');
    return result;
}

// ===== ANIMATIONS =====
const _animStyle = document.createElement('style');
_animStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0);    opacity: 1; }
        to   { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(_animStyle);

// ===== LOGIN REDIRECT HELPER =====
function redirectByRole(role) {
    if (role === 'admin')        window.location.href = 'admin-dashboard.html';
    else if (role === 'healthworker') window.location.href = 'doctor-dashboard.html';
    else                         window.location.href = 'patient-dashboard.html';
}

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function () {

    // ── Patient login ─────────────────────────────────
    const patientLoginForm = document.getElementById('patientLoginForm');
    if (patientLoginForm) {
        patientLoginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            try {
                const response = await apiRequest('/auth/login', 'POST', { email, password });
                setAuthToken(response.token);
                setUserType(response.user.role);
                setUserData(response.user);
                showMessage('Login successful!', 'success');
                setTimeout(() => redirectByRole(response.user.role), 1000);
            } catch (err) {
                showMessage(err.message || 'Login failed. Please try again.', 'error');
            }
        });
    }

    // ── Doctor login ──────────────────────────────────
    const doctorLoginForm = document.getElementById('doctorLoginForm');
    if (doctorLoginForm) {
        doctorLoginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            try {
                const response = await apiRequest('/auth/login', 'POST', { email, password });
                setAuthToken(response.token);
                setUserType(response.user.role);
                setUserData(response.user);
                showMessage('Login successful!', 'success');
                setTimeout(() => redirectByRole(response.user.role), 1000);
            } catch (err) {
                showMessage(err.message || 'Login failed. Please try again.', 'error');
            }
        });
    }

    // ── Admin login ───────────────────────────────────
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            try {
                const response = await apiRequest('/auth/login', 'POST', { email, password });
                setAuthToken(response.token);
                setUserType(response.user.role);
                setUserData(response.user);
                showMessage('Admin login successful!', 'success');
                setTimeout(() => redirectByRole(response.user.role), 1000);
            } catch (err) {
                showMessage(err.message || 'Login failed. Please try again.', 'error');
            }
        });
    }

    // ── Patient signup ────────────────────────────────
    const patientSignupForm = document.getElementById('patientSignupForm');
    if (patientSignupForm) {
        patientSignupForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const firstName       = document.getElementById('firstName').value.trim();
            const lastName        = document.getElementById('lastName').value.trim();
            const email           = document.getElementById('email').value.trim();
            const phone           = document.getElementById('phone').value.trim();
            const password        = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            if (!validatePhone(phone)) {
                showMessage('Please enter a valid Nigerian phone number', 'error');
                return;
            }
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }

            try {
                await apiRequest('/auth/register', 'POST', {
                    fullName: firstName + ' ' + lastName,
                    email,
                    phone,
                    password,
                    role: 'patient'
                });
                showMessage('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => { window.location.href = 'patient-login.html'; }, 2000);
            } catch (err) {
                showMessage(err.message || 'Registration failed. Please try again.', 'error');
            }
        });
    }

    // ── Profile update ────────────────────────────────
    // NOTE: doctor-signup and all dashboard forms handle their own
    // submission logic inline. Only patient profile update lives here.
    const profileForm = document.getElementById('profileForm');
    if (profileForm && getUserType() === 'patient') {
        profileForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            try {
                await apiRequest('/patients/me', 'PUT', {
                    phone:   document.getElementById('profilePhone')?.value,
                    address: { street: document.getElementById('profileAddress')?.value }
                });
                showMessage('Profile updated successfully!', 'success');
            } catch (err) {
                showMessage(err.message || 'Failed to update profile', 'error');
            }
        });
    }

});

console.log('RuralCare360 app.js loaded');
