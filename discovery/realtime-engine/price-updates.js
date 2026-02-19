// discovery/realtime-engine/price-updates.js
// Price update handling – real‑time price changes on listings

window.AHSS = window.AHSS || {};
window.AHSS.discovery = window.AHSS.discovery || {};
window.AHSS.discovery.realtime = window.AHSS.discovery.realtime || {};

(function() {
    let priceUpdateCallbacks = [];

    function init() {
        // Subscribe to price changes via core
        window.AHSS.discovery.realtime.core.subscribe('price_changed', handlePriceChange);
    }

    function handlePriceChange(update) {
        const { listingId, newPrice, oldPrice } = update;
        // Update listing in data store
        const listing = window.AHSS.data?.getListingById(listingId);
        if (listing) {
            listing.price = newPrice;
            // Trigger UI update
            window.AHSS.app?.emit('listings_updated', window.AHSS.state?.filteredListings);
            // Show notification if price dropped
            if (newPrice < oldPrice) {
                window.AHSS.ui.toasts?.info(`💰 Price dropped for ${listing.title}! Now $${newPrice}`);
            }
        }
        // Execute callbacks
        priceUpdateCallbacks.forEach(cb => cb(update));
    }

    function onPriceUpdate(callback) {
        priceUpdateCallbacks.push(callback);
    }

    window.AHSS.discovery.realtime.priceUpdates = {
        init,
        onPriceUpdate
    };

    // Auto-init
    document.addEventListener('DOMContentLoaded', init);
})();