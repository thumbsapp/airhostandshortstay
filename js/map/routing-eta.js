// js/map/routing-eta.js
// ETA and routing between user and listings (simulated)

window.AHSS = window.AHSS || {};
window.AHSS.map = window.AHSS.map || {};

(function() {
    const routing = {
        // Simulate ETA calculation based on straight-line distance (very approximate)
        calculateETA: function(fromLat, fromLng, toLat, toLng, mode = 'driving') {
            const distance = this.haversineDistance(fromLat, fromLng, toLat, toLng);
            // Assume average speeds: driving 50 km/h, walking 5 km/h, cycling 15 km/h
            let speed = 50;
            if (mode === 'walking') speed = 5;
            if (mode === 'cycling') speed = 15;
            const hours = distance / speed;
            const minutes = Math.round(hours * 60);
            return { distance: distance.toFixed(1), minutes, mode };
        },

        haversineDistance: function(lat1, lon1, lat2, lon2) {
            const R = 6371; // km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        },

        // Draw a route line (simulated straight line)
        drawRoute: function(map, from, to, color = '#10b981') {
            if (!map) return;
            const latlngs = [[from.lat, from.lng], [to.lat, to.lng]];
            const polyline = L.polyline(latlngs, { color, weight: 3, dashArray: '5,8' }).addTo(map);
            return polyline;
        }
    };

    window.AHSS.map.routing = routing;
})();