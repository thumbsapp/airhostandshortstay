// js/ui/toasts.js
// Toast notifications – non‑intrusive messages that auto‑dismiss

window.AHSS = window.AHSS || {};
window.AHSS.ui = window.AHSS.ui || {};

(function() {
    let container = null;
    let activeToasts = [];

    function init() {
        if (!document.querySelector('.toast-container')) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        } else {
            container = document.querySelector('.toast-container');
        }
    }

    function show(message, type = 'info', duration = 4000) {
        init();
        const id = Date.now() + Math.random();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.dataset.id = id;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;
        toast.querySelector('.toast-close').addEventListener('click', () => {
            dismiss(id);
        });
        container.appendChild(toast);
        activeToasts.push({ id, element: toast, timeout: null });

        // Auto dismiss after duration
        const timeout = setTimeout(() => dismiss(id), duration);
        activeToasts.find(t => t.id === id).timeout = timeout;

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
    }

    function dismiss(id) {
        const index = activeToasts.findIndex(t => t.id === id);
        if (index === -1) return;
        const toast = activeToasts[index];
        clearTimeout(toast.timeout);
        toast.element.classList.remove('show');
        setTimeout(() => {
            if (toast.element.parentNode) toast.element.remove();
            activeToasts.splice(index, 1);
        }, 300);
    }

    function success(message, duration) {
        show(message, 'success', duration);
    }

    function error(message, duration) {
        show(message, 'error', duration);
    }

    function warning(message, duration) {
        show(message, 'warning', duration);
    }

    function info(message, duration) {
        show(message, 'info', duration);
    }

    window.AHSS.ui.toasts = {
        show,
        success,
        error,
        warning,
        info,
        dismiss
    };
})();