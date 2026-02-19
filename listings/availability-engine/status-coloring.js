// listings/availability-engine/status-coloring.js
// Determine color for availability status (green/amber/red)

window.AHSS = window.AHSS || {};
window.AHSS.listings = window.AHSS.listings || {};
window.AHSS.listings.availability = window.AHSS.listings.availability || {};

(function() {
    function getStatusColor(status) {
        switch (status) {
            case 'available':
                return '#10b981'; // green
            case 'almost_gone':
                return '#f59e0b'; // amber
            case 'booked':
                return '#ef4444'; // red
            default:
                return '#94a3b8'; // gray
        }
    }

    function getStatusBadge(status, remaining = null) {
        const color = getStatusColor(status);
        let text = status.replace('_', ' ');
        if (remaining !== null && status === 'almost_gone') {
            text = `⚡ Only ${remaining} left`;
        }
        return `<span class="availability-badge" style="background:${color}20; color:${color};">${text}</span>`;
    }

    // Apply color to map pin
    function getPinColor(listing) {
        return getStatusColor(listing.availability);
    }

    window.AHSS.listings.availability.statusColoring = {
        getStatusColor,
        getStatusBadge,
        getPinColor
    };
})();