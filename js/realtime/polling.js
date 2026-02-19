// js/realtime/polling.js
// Polling fallback for real-time updates when WebSocket unavailable

window.AHSS = window.AHSS || {};
window.AHSS.realtime = window.AHSS.realtime || {};

(function() {
    let pollInterval = null;
    const POLL_INTERVAL_MS = 10000; // 10 seconds
    let lastUpdate = Date.now();

    function start() {
        if (pollInterval) return;
        pollInterval = setInterval(() => {
            poll();
        }, POLL_INTERVAL_MS);
        console.log('Polling started');
    }

    function stop() {
        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
        }
    }

    async function poll() {
        try {
            // Simulate polling for updated listings
            // In real app, would fetch /api/updates since=lastUpdate
            const response = await fetch(`/api/updates?since=${lastUpdate}`);
            const data = await response.json();
            lastUpdate = Date.now();
            // Process updates
            data.updates?.forEach(update => {
                window.AHSS.realtime.core.handleMessage(update);
            });
        } catch (e) {
            console.warn('Polling error', e);
        }
    }

    // Simulate a mock update for demo
    function mockUpdate() {
        setInterval(() => {
            // Randomly update a listing's availability
            const listings = window.AHSS.state?.allListings;
            if (listings && listings.length > 0) {
                const randomIndex = Math.floor(Math.random() * listings.length);
                const listing = listings[randomIndex];
                const oldAvail = listing.availability;
                const newAvail = oldAvail === 'available' ? 'almost_gone' : (oldAvail === 'almost_gone' ? 'booked' : 'available');
                listing.availability = newAvail;
                window.AHSS.realtime.core.handleMessage({
                    type: 'listing_updated',
                    payload: { id: listing.id, availability: newAvail }
                });
            }
        }, 15000);
    }

    window.AHSS.realtime.polling = {
        start,
        stop,
        mockUpdate
    };

    // For demo, start mock updates if polling is active
    window.AHSS.app?.on('app_initialized', () => {
        if (window.AHSS.config?.features?.realtimeUpdates && !window.WebSocket) {
            // In demo, we can start mock
            mockUpdate();
        }
    });
})();