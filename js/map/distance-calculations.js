// js/map/distance-calculations.js
// Pure distance and proximity calculations

window.AHSS = window.AHSS || {};
window.AHSS.map = window.AHSS.map || {};

(function() {
    const distanceCalc = {
        // Haversine formula
        haversine: function(lat1, lon1, lat2, lon2) {
            const R = 6371; // km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        },

        // Sort listings by distance from a point
        sortByDistance: function(listings, refLat, refLng) {
            return listings.map(l => ({
                ...l,
                distance: this.haversine(refLat, refLng, l.lat, l.lng)
            })).sort((a, b) => a.distance - b.distance);
        },

        // Filter listings within radius
        withinRadius: function(listings, refLat, refLng, radiusKm) {
            return listings.filter(l => {
                const d = this.haversine(refLat, refLng, l.lat, l.lng);
                return d <= radiusKm;
            });
        },

        // Get bounding box from center and radius (approx)
        boundingBox: function(lat, lng, radiusKm) {
            const latChange = radiusKm / 111.32; // 1 deg lat ~ 111.32 km
            const lngChange = radiusKm / (111.32 * Math.cos(lat * Math.PI / 180));
            return {
                minLat: lat - latChange,
                maxLat: lat + latChange,
                minLng: lng - lngChange,
                maxLng: lng + lngChange
            };
        }
    };

    window.AHSS.map.distance = distanceCalc;
})();