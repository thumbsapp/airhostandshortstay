// js/auth/login.js
// Login module – handles login form, authentication, session management

window.AHSS = window.AHSS || {};
window.AHSS.auth = window.AHSS.auth || {};

(function() {
    let currentUser = null;

    // Load user from session storage
    function loadSession() {
        try {
            const stored = sessionStorage.getItem('ahss_user');
            if (stored) {
                currentUser = JSON.parse(stored);
            }
        } catch (e) {}
        return currentUser;
    }

    // Save user to session
    function saveSession(user) {
        try {
            sessionStorage.setItem('ahss_user', JSON.stringify(user));
        } catch (e) {}
    }

    // Clear session
    function logout() {
        currentUser = null;
        sessionStorage.removeItem('ahss_user');
        window.AHSS.app?.emit('auth_changed', null);
        // Redirect to home
        window.location.href = 'index.html';
    }

    // Simulate login (in real app would call API)
    async function login(email, password) {
        // Mock validation
        if (!email || !password) return { success: false, error: 'Email and password required' };
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        // Accept any credentials for demo
        const user = {
            id: 123,
            email,
            name: email.split('@')[0],
            role: email.includes('host') ? 'host' : 'guest',
            verified: true
        };
        currentUser = user;
        saveSession(user);
        window.AHSS.app?.emit('auth_changed', user);
        return { success: true, user };
    }

    // Get current user
    function getCurrentUser() {
        if (!currentUser) loadSession();
        return currentUser;
    }

    // Check if logged in
    function isLoggedIn() {
        return !!getCurrentUser();
    }

    // Render login form
    function renderLoginForm(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        container.innerHTML = `
            <div class="auth-form">
                <h2>Login</h2>
                <input type="email" id="login-email" placeholder="Email" />
                <input type="password" id="login-password" placeholder="Password" />
                <button id="login-submit" class="btn-apply">Login</button>
                <p id="login-error" style="color:#ef4444;"></p>
                <p>Don't have an account? <a href="#" id="show-register">Register</a></p>
            </div>
        `;

        document.getElementById('login-submit')?.addEventListener('click', async () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorEl = document.getElementById('login-error');
            const result = await login(email, password);
            if (result.success) {
                // Redirect based on role
                if (result.user.role === 'host') {
                    window.location.href = 'dashboard-host.html';
                } else {
                    window.location.href = 'dashboard-guest.html';
                }
            } else {
                errorEl.textContent = result.error || 'Login failed';
            }
        });

        document.getElementById('show-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.AHSS.auth.register) {
                window.AHSS.auth.register.renderRegisterForm(containerSelector);
            }
        });
    }

    window.AHSS.auth.login = {
        login,
        logout,
        getCurrentUser,
        isLoggedIn,
        renderLoginForm
    };

    // Auto-load session
    loadSession();
})();