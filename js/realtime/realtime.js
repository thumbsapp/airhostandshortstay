// js/realtime/realtime.js
// Realtime module – manages real-time updates via WebSocket or polling

window.AHSS = window.AHSS || {};
window.AHSS.realtime = window.AHSS.realtime || {};

(function() {
    let listeners = {};
    let isConnected = false;

    // Initialize realtime (choose between ws or polling based on config)
    function init() {
        if (window.AHSS.config?.features?.realtimeUpdates) {
            if (window.WebSocket) {
                window.AHSS.realtime.websocket.connect();
            } else {
                window.AHSS.realtime.polling.start();
            }
        } else {
            console.log('Realtime updates disabled');
        }
    }

    // Subscribe to an event
    function on(event, callback) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
    }

    // Emit event (internal)
    function emit(event, data) {
        if (!listeners[event]) return;
        listeners[event].forEach(cb => cb(data));
    }

    // Handle incoming message (from WebSocket or polling)
    function handleMessage(message) {
        try {
            const data = typeof message === 'string' ? JSON.parse(message) : message;
            if (data.type) {
                emit(data.type, data.payload);
            }
        } catch (e) {
            console.warn('Invalid realtime message', e);
        }
    }

    // Update a listing's availability in realtime
    function updateListingAvailability(listingId, availability) {
        // Find and update listing in data store
        const listing = window.AHSS.data?.getListingById(listingId);
        if (listing) {
            listing.availability = availability;
            // Trigger UI update
            window.AHSS.app?.emit('listings_updated', window.AHSS.state?.filteredListings);
        }
    }

    // Public API
    window.AHSS.realtime.core = {
        init,
        on,
        emit,
        handleMessage,
        updateListingAvailability
    };

    // Auto-init after app
    window.AHSS.app?.on('app_initialized', () => {
        init();
    });
})();