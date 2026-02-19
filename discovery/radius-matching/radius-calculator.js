// discovery/radius-matching/radius-calculator.js
// Radius calculation utilities (distance, filtering)

window.AHSS = window.AHSS || {};
window.AHSS.discovery = window.AHSS.discovery || {};
window.AHSS.discovery.radius = window.AHSS.discovery.radius || {};

(function() {
    // Haversine formula (km)
    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Filter listings within radius of a point
    function withinRadius(listings, centerLat, centerLng, radiusKm) {
        return listings.filter(l => {
            if (!l.lat || !l.lng) return false;
            const dist = haversine(centerLat, centerLng, l.lat, l.lng);
            return dist <= radiusKm;
        });
    }

    // Sort listings by distance from point
    function sortByDistance(listings, centerLat, centerLng) {
        return listings.map(l => ({
            ...l,
            distance: haversine(centerLat, centerLng, l.lat, l.lng)
        })).sort((a, b) => a.distance - b.distance);
    }

    // Get bounding box (approx) from center and radius
    function boundingBox(centerLat, centerLng, radiusKm) {
        const latChange = radiusKm / 111.32;
        const lngChange = radiusKm / (111.32 * Math.cos(centerLat * Math.PI / 180));
        return {
            minLat: centerLat - latChange,
            maxLat: centerLat + latChange,
            minLng: centerLng - lngChange,
            maxLng: centerLng + lngChange
        };
    }

    window.AHSS.discovery.radius.calculator = {
        haversine,
        withinRadius,
        sortByDistance,
        boundingBox
    };
})();