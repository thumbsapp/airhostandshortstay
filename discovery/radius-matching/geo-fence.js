// discovery/radius-matching/geo-fence.js
// Geo‑fencing – detect when user enters/exits areas, trigger actions

window.AHSS = window.AHSS || {};
window.AHSS.discovery = window.AHSS.discovery || {};
window.AHSS.discovery.radius = window.AHSS.discovery.radius || {};

(function() {
    let fences = []; // { id, lat, lng, radius, onEnter, onExit }
    let userLocation = null;
    let watchId = null;

    function init() {
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                position => {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    checkFences();
                },
                err => console.warn('Geolocation error', err),
                { enableHighAccuracy: true, maximumAge: 10000 }
            );
        }
    }

    function addFence(fence) {
        fences.push(fence);
    }

    function removeFence(id) {
        fences = fences.filter(f => f.id !== id);
    }

    function checkFences() {
        if (!userLocation) return;
        fences.forEach(fence => {
            const distance = window.AHSS.discovery.radius.calculator.haversine(
                userLocation.lat, userLocation.lng,
                fence.lat, fence.lng
            );
            const inside = distance <= fence.radius;
            const wasInside = fence.inside || false;
            if (inside && !wasInside) {
                fence.inside = true;
                if (fence.onEnter) fence.onEnter(fence);
            } else if (!inside && wasInside) {
                fence.inside = false;
                if (fence.onExit) fence.onExit(fence);
            }
        });
    }

    function stopWatching() {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
    }

    window.AHSS.discovery.radius.geoFence = {
        init,
        addFence,
        removeFence,
        stopWatching
    };
})();