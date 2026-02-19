// js/auth/roles.js
// Role-based access control and permissions

window.AHSS = window.AHSS || {};
window.AHSS.auth = window.AHSS.auth || {};

(function() {
    const rolePermissions = {
        guest: [
            'view_listings',
            'book_property',
            'use_services',
            'negotiate',
            'use_lipa_mdogo',
            'add_wishlist',
            'compare',
            'view_dashboard_guest',
            'raise_dispute'
        ],
        host: [
            'view_listings',
            'manage_listings',
            'create_incentives',
            'view_bookings',
            'respond_to_negotiations',
            'view_dashboard_host',
            'respond_to_disputes'
        ],
        admin: [
            'all'
        ]
    };

    // Check if current user has permission
    function hasPermission(permission) {
        const user = window.AHSS.auth.login.getCurrentUser();
        if (!user) return false;
        const role = user.role;
        const perms = rolePermissions[role] || [];
        if (perms.includes('all')) return true;
        return perms.includes(permission);
    }

    // Check if user is logged in
    function requireAuth(redirectTo = 'login.html') {
        if (!window.AHSS.auth.login.isLoggedIn()) {
            window.location.href = redirectTo;
            return false;
        }
        return true;
    }

    // Restrict page to certain roles
    function restrictTo(roles) {
        const user = window.AHSS.auth.login.getCurrentUser();
        if (!user || !roles.includes(user.role)) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    // Get current role
    function getRole() {
        const user = window.AHSS.auth.login.getCurrentUser();
        return user ? user.role : null;
    }

    // Hide elements based on role
    function applyRoleBasedUI() {
        const role = getRole();
        document.querySelectorAll('[data-role]').forEach(el => {
            const requiredRole = el.dataset.role;
            if (role !== requiredRole) {
                el.style.display = 'none';
            } else {
                el.style.display = '';
            }
        });
    }

    window.AHSS.auth.roles = {
        hasPermission,
        requireAuth,
        restrictTo,
        getRole,
        applyRoleBasedUI
    };

    // Auto-apply role UI after auth change
    window.AHSS.app?.on('auth_changed', () => {
        applyRoleBasedUI();
    });

    // Apply on load if user exists
    document.addEventListener('DOMContentLoaded', () => {
        applyRoleBasedUI();
    });
})();