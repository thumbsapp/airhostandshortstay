// engagement/alerts/price-alerts.js
// Price alert system – notify users when price drops for a listing

window.AHSS = window.AHSS || {};
window.AHSS.engagement = window.AHSS.engagement || {};
window.AHSS.engagement.alerts = window.AHSS.engagement.alerts || {};

(function() {
    let priceAlerts = []; // { listingId, targetPrice, userId, createdAt }

    // Load from localStorage (simplified)
    function load() {
        try {
            const stored = localStorage.getItem('ahss_price_alerts');
            priceAlerts = stored ? JSON.parse(stored) : [];
        } catch (e) {}
    }

    function save() {
        localStorage.setItem('ahss_price_alerts', JSON.stringify(priceAlerts));
    }

    // Add a price alert
    function addAlert(listingId, targetPrice) {
        const existing = priceAlerts.find(a => a.listingId === listingId);
        if (existing) {
            existing.targetPrice = targetPrice;
            existing.createdAt = Date.now();
        } else {
            priceAlerts.push({
                listingId,
                targetPrice,
                userId: 'current-user', // would come from auth
                createdAt: Date.now()
            });
        }
        save();
    }

    // Remove alert
    function removeAlert(listingId) {
        priceAlerts = priceAlerts.filter(a => a.listingId !== listingId);
        save();
    }

    // Check all alerts against current prices
    function checkAlerts() {
        priceAlerts.forEach(alert => {
            const listing = window.AHSS.data?.getListingById(alert.listingId);
            if (listing && listing.price <= alert.targetPrice) {
                // Trigger notification
                window.AHSS.engagement.alerts.notificationBadge?.show(`Price dropped for ${listing.title}! Now $${listing.price}`);
                // Optionally remove alert after triggering
                removeAlert(alert.listingId);
            }
        });
    }

    // Start periodic checking (every 60 seconds)
    function startPolling(intervalMs = 60000) {
        setInterval(checkAlerts, intervalMs);
    }

    window.AHSS.engagement.alerts.priceAlerts = {
        load,
        addAlert,
        removeAlert,
        checkAlerts,
        startPolling
    };

    // Auto-load
    document.addEventListener('DOMContentLoaded', load);
})();