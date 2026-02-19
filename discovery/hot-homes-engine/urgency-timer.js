// discovery/hot-homes-engine/urgency-timer.js
// Urgency timers for Hot Homes – countdowns, real‑time updates, UI flashes

window.AHSS = window.AHSS || {};
window.AHSS.discovery = window.AHSS.discovery || {};
window.AHSS.discovery.hotHomes = window.AHSS.discovery.hotHomes || {};

(function() {
    let timers = new Map(); // listingId -> { timeout, endTime, element }

    function init() {
        // Find all countdown badges and start timers
        document.querySelectorAll('.countdown-badge[data-end]').forEach(el => {
            const listingId = el.closest('[data-id]')?.dataset.id;
            if (!listingId) return;
            const endTime = new Date(el.dataset.end).getTime();
            startTimer(listingId, endTime, el);
        });
    }

    function startTimer(listingId, endTime, element) {
        if (timers.has(listingId)) {
            clearInterval(timers.get(listingId).interval);
        }
        const update = () => {
            const now = Date.now();
            const diff = endTime - now;
            if (diff <= 0) {
                element.textContent = '⏳ Expired';
                element.classList.add('expired');
                stopTimer(listingId);
                // Optionally emit event
                window.AHSS.app?.emit('hot_home_expired', listingId);
                return;
            }
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            element.textContent = `⏳ ${hours}h ${minutes}m ${seconds}s`;
        };
        update();
        const interval = setInterval(update, 1000);
        timers.set(listingId, { interval, endTime, element });
    }

    function stopTimer(listingId) {
        if (timers.has(listingId)) {
            clearInterval(timers.get(listingId).interval);
            timers.delete(listingId);
        }
    }

    // Create a new urgency timer for a listing (e.g., when added to Hot Homes)
    function createTimer(listingId, durationMinutes = 30, container) {
        const endTime = Date.now() + durationMinutes * 60 * 1000;
        const element = document.createElement('span');
        element.className = 'countdown-badge';
        element.dataset.end = new Date(endTime).toISOString();
        container.appendChild(element);
        startTimer(listingId, endTime, element);
    }

    window.AHSS.discovery.hotHomes.urgency = {
        init,
        startTimer,
        stopTimer,
        createTimer
    };

    // Auto-start on page load
    document.addEventListener('DOMContentLoaded', init);
})();