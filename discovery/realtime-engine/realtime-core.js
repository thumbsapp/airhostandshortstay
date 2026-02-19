// discovery/realtime-engine/realtime-core.js
// Core realtime engine – manages subscriptions and dispatches updates

window.AHSS = window.AHSS || {};
window.AHSS.discovery = window.AHSS.discovery || {};
window.AHSS.discovery.realtime = window.AHSS.discovery.realtime || {};

(function() {
    const subscriptions = new Map(); // eventName -> Set of callbacks
    let engineInitialized = false;

    function init() {
        if (engineInitialized) return;
        engineInitialized = true;
        console.log('Realtime engine initialized');
        // Optionally connect to WebSocket or start polling
    }

    function subscribe(event, callback) {
        if (!subscriptions.has(event)) {
            subscriptions.set(event, new Set());
        }
        subscriptions.get(event).add(callback);
    }

    function unsubscribe(event, callback) {
        if (!subscriptions.has(event)) return;
        if (callback) {
            subscriptions.get(event).delete(callback);
        } else {
            subscriptions.delete(event);
        }
    }

    function publish(event, data) {
        if (!subscriptions.has(event)) return;
        subscriptions.get(event).forEach(cb => {
            try {
                cb(data);
            } catch (e) {
                console.error(`Error in realtime handler for ${event}`, e);
            }
        });
    }

    // Handle incoming messages from transport (WebSocket/polling)
    function handleIncoming(message) {
        if (message.type === 'listing_update') {
            publish('listing_updated', message.payload);
        } else if (message.type === 'price_change') {
            publish('price_changed', message.payload);
        } else if (message.type === 'availability_change') {
            publish('availability_changed', message.payload);
        } else if (message.type === 'incentive_update') {
            publish('incentive_updated', message.payload);
        }
    }

    window.AHSS.discovery.realtime.core = {
        init,
        subscribe,
        unsubscribe,
        publish,
        handleIncoming
    };

    // Auto-init
    document.addEventListener('DOMContentLoaded', init);
})();