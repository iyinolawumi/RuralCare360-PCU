/* ===================================
   RuralCare360 - Main JavaScript
   =================================== */

// ===== CONFIGURATION =====
const API_BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

// ===== UTILITY FUNCTIONS =====
function showMessage(message, type = 'success') {
    // Create and show notification message
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

function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}

function setUserType(type) {
    localStorage.setItem('userType', type);
}

function getUserType() {
    return localStorage.getItem('userType');
}

function setUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

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

// ===== API FUNCTIONS =====
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    const token = getAuthToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ===== ANIMATIONS =====
// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== WAIT FOR DOM TO LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    
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
                // Simulate API call - Replace with actual API endpoint
                const response = await apiRequest('/auth/patient/login', 'POST', {
                    email,
                    password
                });
                
                setAuthToken(response.token);
                setUserType('patient');
                setUserData(response.user);
                showMessage('Login successful!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
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
                // Simulate API call - Replace with actual API endpoint
                const response = await apiRequest('/auth/doctor/login', 'POST', {
                    email,
                    password
                });
                
                setAuthToken(response.token);
                setUserType('doctor');
                setUserData(response.user);
                showMessage('Login successful!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
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
                // Simulate API call - Replace with actual API endpoint
                const response = await apiRequest('/auth/admin/login', 'POST', {
                    email,
                    password
                });
                
                setAuthToken(response.token);
                setUserType('admin');
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
            
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                gender: document.getElementById('gender').value,
                address: document.getElementById('address').value,
                state: document.getElementById('state').value,
                lga: document.getElementById('lga').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value
            };
            
            // Validation
            if (!validateEmail(formData.email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            if (!validatePhone(formData.phone)) {
                showMessage('Please enter a valid Nigerian phone number', 'error');
                return;
            }
            
            if (formData.password.length < 8) {
                showMessage('Password must be at least 8 characters long', 'error');
                return;
            }
            
            if (formData.password !== formData.confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            try {
                // Simulate API call - Replace with actual API endpoint
                const response = await apiRequest('/auth/patient/register', 'POST', formData);
                
                showMessage('Registration successful! Redirecting to login...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'patient-login.html';
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
            
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                specialization: document.getElementById('specialization').value,
                licenseNumber: document.getElementById('licenseNumber').value,
                yearsOfExperience: document.getElementById('yearsOfExperience').value,
                hospitalAffiliation: document.getElementById('hospitalAffiliation').value,
                state: document.getElementById('state').value,
                lga: document.getElementById('lga').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value
            };
            
            // Validation
            if (!validateEmail(formData.email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            if (!validatePhone(formData.phone)) {
                showMessage('Please enter a valid Nigerian phone number', 'error');
                return;
            }
            
            if (formData.password.length < 8) {
                showMessage('Password must be at least 8 characters long', 'error');
                return;
            }
            
            if (formData.password !== formData.confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            try {
                // Simulate API call - Replace with actual API endpoint
                const response = await apiRequest('/auth/doctor/register', 'POST', formData);
                
                showMessage('Registration successful! Redirecting to login...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'doctor-login.html';
                }, 2000);
                
            } catch (error) {
                showMessage(error.message || 'Registration failed. Please try again.', 'error');
            }
        });
    }

    // ===== DASHBOARD FUNCTIONALITY =====
    // Check authentication on dashboard
    if (window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('admin-dashboard.html')) {
        const token = getAuthToken();
        const userType = getUserType();
        const userData = getUserData();
        
        // Comment out redirect for testing - uncomment when backend is ready
        /*
        if (!token || !userType) {
            window.location.href = 'index.html';
        }
        */
        
        // Update user greeting
        const userGreeting = document.getElementById('userGreeting');
        if (userGreeting && userData) {
            userGreeting.textContent = `Welcome, ${userData.firstName || 'User'}`;
        } else if (userGreeting) {
            userGreeting.textContent = 'Welcome, User';
        }
    }

    // ===== SIDEBAR NAVIGATION =====
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    console.log('Sidebar items found:', sidebarItems.length);
    console.log('Dashboard sections found:', dashboardSections.length);

    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = item.getAttribute('data-section');
            console.log('Clicked section:', sectionId);
            
            // Remove active class from all items and sections
            sidebarItems.forEach(i => i.classList.remove('active'));
            dashboardSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked item and corresponding section
            item.classList.add('active');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                console.log('Section activated:', sectionId);
            } else {
                console.error('Section not found:', sectionId);
            }
            
            // Scroll to top of dashboard main area
            const dashboardMain = document.querySelector('.dashboard-main');
            if (dashboardMain) {
                dashboardMain.scrollTop = 0;
            }
        });
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    }

    // Profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('profileFirstName').value,
                lastName: document.getElementById('profileLastName').value,
                email: document.getElementById('profileEmail').value,
                phone: document.getElementById('profilePhone').value,
                address: document.getElementById('profileAddress').value
            };
            
            try {
                // Simulate API call - Replace with actual API endpoint
                await apiRequest('/user/profile', 'PUT', formData);
                
                showMessage('Profile updated successfully!', 'success');
                
                // Update stored user data
                const userData = getUserData();
                setUserData({ ...userData, ...formData });
                
            } catch (error) {
                showMessage(error.message || 'Failed to update profile', 'error');
            }
        });
    }

    // Password change form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            
            if (newPassword.length < 8) {
                showMessage('New password must be at least 8 characters long', 'error');
                return;
            }
            
            if (newPassword !== confirmNewPassword) {
                showMessage('New passwords do not match', 'error');
                return;
            }
            
            try {
                // Simulate API call - Replace with actual API endpoint
                await apiRequest('/user/change-password', 'PUT', {
                    currentPassword,
                    newPassword
                });
                
                showMessage('Password changed successfully!', 'success');
                passwordForm.reset();
                
            } catch (error) {
                showMessage(error.message || 'Failed to change password', 'error');
            }
        });
    }

    // New appointment button
    const newAppointmentBtn = document.getElementById('newAppointmentBtn');
    if (newAppointmentBtn) {
        newAppointmentBtn.addEventListener('click', () => {
            // This would open a modal or navigate to appointment booking page
            showMessage('Appointment booking feature coming soon!', 'success');
        });
    }

    // Request consultation button
    const requestConsultationBtn = document.getElementById('requestConsultationBtn');
    if (requestConsultationBtn) {
        requestConsultationBtn.addEventListener('click', () => {
            // This would open a modal or navigate to consultation request page
            showMessage('Consultation request feature coming soon!', 'success');
        });
    }

    // Add record button
    const addRecordBtn = document.getElementById('addRecordBtn');
    if (addRecordBtn) {
        addRecordBtn.addEventListener('click', () => {
            // This would open a modal for adding health records
            showMessage('Add health record feature coming soon!', 'success');
        });
    }

}); // End of DOMContentLoaded

console.log('RuralCare360 JavaScript loaded successfully!');
