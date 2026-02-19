// discovery/realtime-engine/availability-sync.js
// Real‑time availability sync – updates status and countdowns

window.AHSS = window.AHSS || {};
window.AHSS.discovery = window.AHSS.discovery || {};
window.AHSS.discovery.realtime = window.AHSS.discovery.realtime || {};

(function() {
    let availabilityCallbacks = [];

    function init() {
        window.AHSS.discovery.realtime.core.subscribe('availability_changed', handleAvailabilityChange);
    }

    function handleAvailabilityChange(update) {
        const { listingId, availability, remaining } = update;
        const listing = window.AHSS.data?.getListingById(listingId);
        if (listing) {
            listing.availability = availability;
            if (remaining !== undefined) listing.remaining = remaining;
            // Update any countdown badges
            updateCountdownBadges(listingId, remaining);
            // Emit event for UI refresh
            window.AHSS.app?.emit('listings_updated', window.AHSS.state?.filteredListings);
        }
        availabilityCallbacks.forEach(cb => cb(update));
    }

    function updateCountdownBadges(listingId, remaining) {
        const badge = document.querySelector(`.listing-card-enhanced[data-id="${listingId}"] .countdown-badge`);
        if (badge && remaining !== undefined) {
            badge.textContent = `⏳ ${remaining} left`;
            if (remaining === 0) {
                badge.classList.add('sold-out');
            }
        }
    }

    function onAvailabilityChange(callback) {
        availabilityCallbacks.push(callback);
    }

    window.AHSS.discovery.realtime.availabilitySync = {
        init,
        onAvailabilityChange
    };

    document.addEventListener('DOMContentLoaded', init);
})();