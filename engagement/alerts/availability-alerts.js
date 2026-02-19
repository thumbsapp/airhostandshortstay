// engagement/alerts/availability-alerts.js
// Availability alerts – notify when a previously booked listing becomes available

window.AHSS = window.AHSS || {};
window.AHSS.engagement = window.AHSS.engagement || {};
window.AHSS.engagement.alerts = window.AHSS.engagement.alerts || {};

(function() {
    let availabilityAlerts = []; // { listingId, userId, createdAt }

    function load() {
        try {
            const stored = localStorage.getItem('ahss_availability_alerts');
            availabilityAlerts = stored ? JSON.parse(stored) : [];
        } catch (e) {}
    }

    function save() {
        localStorage.setItem('ahss_availability_alerts', JSON.stringify(availabilityAlerts));
    }

    function addAlert(listingId) {
        if (!availabilityAlerts.some(a => a.listingId === listingId)) {
            availabilityAlerts.push({
                listingId,
                userId: 'current-user',
                createdAt: Date.now()
            });
            save();
        }
    }

    function removeAlert(listingId) {
        availabilityAlerts = availabilityAlerts.filter(a => a.listingId !== listingId);
        save();
    }

    // Check alerts against current availability
    function checkAlerts() {
        availabilityAlerts.forEach(alert => {
            const listing = window.AHSS.data?.getListingById(alert.listingId);
            if (listing && listing.availability === 'available') {
                window.AHSS.engagement.alerts.notificationBadge?.show(`${listing.title} is now available!`);
                removeAlert(alert.listingId);
            }
        });
    }

    function startPolling(intervalMs = 30000) {
        setInterval(checkAlerts, intervalMs);
    }

    window.AHSS.engagement.alerts.availabilityAlerts = {
        load,
        addAlert,
        removeAlert,
        checkAlerts,
        startPolling
    };

    document.addEventListener('DOMContentLoaded', load);
})();