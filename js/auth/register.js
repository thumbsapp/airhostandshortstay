// js/auth/register.js
// Registration module

window.AHSS = window.AHSS || {};
window.AHSS.auth = window.AHSS.auth || {};

(function() {
    // Simulate registration
    async function register(name, email, password, role = 'guest') {
        if (!name || !email || !password) return { success: false, error: 'All fields required' };
        await new Promise(resolve => setTimeout(resolve, 800));
        // Mock success
        const user = {
            id: Math.floor(Math.random() * 1000),
            name,
            email,
            role,
            verified: false
        };
        // Auto-login after register
        window.AHSS.auth.login.login(email, password); // this will set session
        return { success: true, user };
    }

    // Render registration form
    function renderRegisterForm(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        container.innerHTML = `
            <div class="auth-form">
                <h2>Register</h2>
                <input type="text" id="reg-name" placeholder="Full name" />
                <input type="email" id="reg-email" placeholder="Email" />
                <input type="password" id="reg-password" placeholder="Password" />
                <select id="reg-role">
                    <option value="guest">Guest</option>
                    <option value="host">Host</option>
                </select>
                <button id="register-submit" class="btn-apply">Register</button>
                <p id="register-error" style="color:#ef4444;"></p>
                <p>Already have an account? <a href="#" id="show-login">Login</a></p>
            </div>
        `;

        document.getElementById('register-submit')?.addEventListener('click', async () => {
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const role = document.getElementById('reg-role').value;
            const errorEl = document.getElementById('register-error');
            const result = await register(name, email, password, role);
            if (result.success) {
                // Redirect
                if (role === 'host') {
                    window.location.href = 'dashboard-host.html';
                } else {
                    window.location.href = 'dashboard-guest.html';
                }
            } else {
                errorEl.textContent = result.error || 'Registration failed';
            }
        });

        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.AHSS.auth.login) {
                window.AHSS.auth.login.renderLoginForm(containerSelector);
            }
        });
    }

    window.AHSS.auth.register = {
        register,
        renderRegisterForm
    };
})();