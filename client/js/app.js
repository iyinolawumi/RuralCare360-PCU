/* ===================================
   RuralCare360 - Main JavaScript
   =================================== */

// ===== CONFIGURATION =====
const API_BASE_URL = 'http://localhost:5000/api';

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
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^0[789][01]\d{8}$/;
    return re.test(phone);
}

function setAuthToken(token) { localStorage.setItem('authToken', token); }
function getAuthToken() { return localStorage.getItem('authToken'); }
function removeAuthToken() { localStorage.removeItem('authToken'); }
function setUserType(type) { localStorage.setItem('userType', type); }
function getUserType() { return localStorage.getItem('userType'); }
function setUserData(userData) { localStorage.setItem('userData', JSON.stringify(userData)); }
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
    const user = getUserData();
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

// ===== API FUNCTIONS =====
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    const token = getAuthToken();
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (data) options.body = JSON.stringify(data);

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Request failed');
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ===== ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== WAIT FOR DOM TO LOAD =====
document.addEventListener('DOMContentLoaded', function () {

    // ===== PATIENT LOGIN =====
    const patientLoginForm = document.getElementById('patientLoginForm');
    if (patientLoginForm) {
        patientLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
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
                setTimeout(() => {
                    window.location.href = 'Dashboard.html';
                }, 1000);
            } catch (error) {
                showMessage(error.message || 'Login failed. Please try again.', 'error');
            }
        });
    }

    // ===== DOCTOR LOGIN =====
    const doctorLoginForm = document.getElementById('doctorLoginForm');
    if (doctorLoginForm) {
        doctorLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
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
                setTimeout(() => {
                    window.location.href = 'Dashboard.html';
                }, 1000);
            } catch (error) {
                showMessage(error.message || 'Login failed. Please try again.', 'error');
            }
        });
    }

    // ===== ADMIN LOGIN =====
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
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
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1000);
            } catch (error) {
                showMessage(error.message || 'Login failed. Please try again.', 'error');
            }
        });
    }

    // ===== PATIENT SIGNUP =====
    const patientSignupForm = document.getElementById('patientSignupForm');
    if (patientSignupForm) {
        patientSignupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
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
                showMessage('Password must be at least 6 characters long', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }

            try {
                await apiRequest('/auth/register', 'POST', {
                    fullName: `${firstName} ${lastName}`,
                    email,
                    phone,
                    password,
                    role: 'patient'
                });
                showMessage('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'Patient-login.html';
                }, 2000);
            } catch (error) {
                showMessage(error.message || 'Registration failed. Please try again.', 'error');
            }
        });
    }

    // ===== DOCTOR SIGNUP =====
    const doctorSignupForm = document.getElementById('doctorSignupForm');
    if (doctorSignupForm) {
        doctorSignupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
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
                showMessage('Password must be at least 6 characters long', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }

            try {
                await apiRequest('/auth/register', 'POST', {
                    fullName: `${firstName} ${lastName}`,
                    email,
                    phone,
                    password,
                    role: 'healthworker'
                });
                showMessage('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'Doctor-login.html';
                }, 2000);
            } catch (error) {
                showMessage(error.message || 'Registration failed. Please try again.', 'error');
            }
        });
    }

    // ===== DASHBOARD AUTH CHECK =====
    if (window.location.pathname.includes('Dashboard.html') ||
        window.location.pathname.includes('admin-dashboard.html')) {

        const token = getAuthToken();
        const userData = getUserData();

        if (!token || !userData) {
            window.location.href = 'index.html';
            return;
        }

        const userGreeting = document.getElementById('userGreeting');
        if (userGreeting && userData) {
            userGreeting.textContent = `Welcome, ${userData.fullName || 'User'}`;
        }
    }

    // ===== SIDEBAR NAVIGATION =====
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    sidebarItems.forEach(item => {
        item.addEventListener('click', function () {
            const sectionId = item.getAttribute('data-section');
            sidebarItems.forEach(i => i.classList.remove('active'));
            dashboardSections.forEach(s => s.classList.remove('active'));
            item.classList.add('active');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) targetSection.classList.add('active');
            const dashboardMain = document.querySelector('.dashboard-main');
            if (dashboardMain) dashboardMain.scrollTop = 0;
        });
    });

    // ===== LOGOUT =====
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) logout();
        });
    }

    // ===== PROFILE UPDATE =====
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await apiRequest('/patients/me', 'PUT', {
                    phone: document.getElementById('profilePhone')?.value,
                    address: {
                        street: document.getElementById('profileAddress')?.value
                    }
                });
                showMessage('Profile updated successfully!', 'success');
            } catch (error) {
                showMessage(error.message || 'Failed to update profile', 'error');
            }
        });
    }

    // ===== APPOINTMENT BOOKING =====
    const newAppointmentBtn = document.getElementById('newAppointmentBtn');
    if (newAppointmentBtn) {
        newAppointmentBtn.addEventListener('click', () => {
            showMessage('Appointment booking feature coming soon!', 'success');
        });
    }

    // ===== CONSULTATION REQUEST =====
    const requestConsultationBtn = document.getElementById('requestConsultationBtn');
    if (requestConsultationBtn) {
        requestConsultationBtn.addEventListener('click', () => {
            showMessage('Consultation request feature coming soon!', 'success');
        });
    }

    // ===== ADD HEALTH RECORD =====
    const addRecordBtn = document.getElementById('addRecordBtn');
    if (addRecordBtn) {
        addRecordBtn.addEventListener('click', () => {
            showMessage('Add health record feature coming soon!', 'success');
        });
    }

}); // End DOMContentLoaded

console.log('RuralCare360 JavaScript loaded successfully!');