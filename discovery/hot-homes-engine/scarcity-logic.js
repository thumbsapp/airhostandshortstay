// discovery/hot-homes-engine/scarcity-logic.js
// Scarcity indicators – remaining units, recent bookings, "almost gone" logic

window.AHSS = window.AHSS || {};
window.AHSS.discovery = window.AHSS.discovery || {};
window.AHSS.discovery.hotHomes = window.AHSS.discovery.hotHomes || {};

(function() {
    // Determine scarcity level based on remaining units and recent bookings
    function getScarcityLevel(listing) {
        const remaining = listing.remaining || 5; // default if not set
        if (remaining <= 1) return 'critical';
        if (remaining <= 3) return 'high';
        if (remaining <= 5) return 'medium';
        return 'low';
    }

    // Generate a badge text based on scarcity
    function getScarcityBadge(listing) {
        const level = getScarcityLevel(listing);
        const remaining = listing.remaining || 5;
        switch (level) {
            case 'critical':
                return `🔥 Only ${remaining} left!`;
            case 'high':
                return `⚡ ${remaining} units remaining`;
            case 'medium':
                return `📊 Limited availability`;
            default:
                return '';
        }
    }

    // Update listing's availability color based on scarcity
    function updateAvailabilityColor(listing) {
        const level = getScarcityLevel(listing);
        if (level === 'critical') return 'red';
        if (level === 'high') return 'amber';
        return 'green';
    }

    // Simulate a recent booking – decrement remaining and update UI
    function simulateBooking(listingId) {
        const listing = window.AHSS.data?.getListingById(listingId);
        if (!listing) return;
        if (!listing.remaining) listing.remaining = 5;
        listing.remaining = Math.max(0, listing.remaining - 1);
        listing.availability = listing.remaining === 0 ? 'booked' : 'almost_gone';
        window.AHSS.app?.emit('listings_updated', window.AHSS.state?.filteredListings);
        // Also emit scarcity update
        window.AHSS.app?.emit('scarcity_updated', { listingId, remaining: listing.remaining });
    }

    window.AHSS.discovery.hotHomes.scarcity = {
        getScarcityLevel,
        getScarcityBadge,
        updateAvailabilityColor,
        simulateBooking
    };
})();