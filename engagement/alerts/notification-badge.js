// engagement/alerts/notification-badge.js
// Notification badge UI (floating badge with count)

window.AHSS = window.AHSS || {};
window.AHSS.engagement = window.AHSS.engagement || {};
window.AHSS.engagement.alerts = window.AHSS.engagement.alerts || {};

(function() {
    let badgeElement = null;
    let notificationCount = 0;

    function createBadge() {
        if (badgeElement) return;
        badgeElement = document.createElement('div');
        badgeElement.className = 'notification-badge';
        badgeElement.style.display = 'none';
        badgeElement.innerHTML = '<span class="badge-count">0</span>';
        document.body.appendChild(badgeElement);

        // Click to show notifications panel (placeholder)
        badgeElement.addEventListener('click', () => {
            window.AHSS.ui.toasts?.info('You have notifications');
        });
    }

    function show(message, duration = 4000) {
        createBadge();
        notificationCount++;
        updateBadgeCount();

        // Also show a toast
        if (window.AHSS.ui.toasts) {
            window.AHSS.ui.toasts.info(message, duration);
        }
    }

    function updateBadgeCount() {
        if (!badgeElement) return;
        const countSpan = badgeElement.querySelector('.badge-count');
        countSpan.textContent = notificationCount;
        badgeElement.style.display = notificationCount > 0 ? 'flex' : 'none';
    }

    function increment() {
        notificationCount++;
        updateBadgeCount();
    }

    function reset() {
        notificationCount = 0;
        updateBadgeCount();
    }

    window.AHSS.engagement.alerts.notificationBadge = {
        show,
        increment,
        reset
    };
})();