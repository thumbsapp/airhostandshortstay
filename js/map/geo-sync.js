// js/map/geo-sync.js
// Geolocation, bounds sync, viewport filtering, radius circle

window.AHSS = window.AHSS || {};
window.AHSS.map = window.AHSS.map || {};

(function() {
    const geo = {
        userLocation: null,
        radiusCircle: null,
        radiusKm: 20,

        init: function(mapInstance) {
            if (!mapInstance) return;
            this.map = mapInstance;

            // Get user location if available
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    pos => this.setUserLocation(pos.coords.latitude, pos.coords.longitude),
                    err => console.warn('Geolocation error', err)
                );
            }

            // Listen to radius filter changes
            window.AHSS.app?.on('state_changed', (change) => {
                if (change.prop === 'filters' && change.value.radius) {
                    this.setRadius(change.value.radius);
                }
            });

            // Draw radius if user location and radius exist
        },

        setUserLocation: function(lat, lng) {
            this.userLocation = { lat, lng };
            // Add a marker for user
            if (this.map) {
                L.marker([lat, lng], {
                    icon: L.divIcon({ html: '📍', className: 'user-location', iconSize: [20,20] })
                }).addTo(this.map);
            }
            this.updateRadiusCircle();
        },

        setRadius: function(km) {
            this.radiusKm = km;
            this.updateRadiusCircle();
        },

        updateRadiusCircle: function() {
            if (!this.map || !this.userLocation) return;
            if (this.radiusCircle) this.map.removeLayer(this.radiusCircle);
            this.radiusCircle = L.circle([this.userLocation.lat, this.userLocation.lng], {
                radius: this.radiusKm * 1000,
                color: '#f59e0b',
                fillColor: '#f59e0b20',
                fillOpacity: 0.2,
                weight: 2,
                dashArray: '5,5'
            }).addTo(this.map);
        },

        // Check if a point is within radius of user
        isWithinRadius: function(lat, lng) {
            if (!this.userLocation) return true; // no user location, ignore
            const R = 6371; // km
            const dLat = (lat - this.userLocation.lat) * Math.PI / 180;
            const dLng = (lng - this.userLocation.lng) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(this.userLocation.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
                      Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;
            return distance <= this.radiusKm;
        },

        // Filter listings based on current map bounds (viewport filtering)
        filterByBounds: function(listings, bounds) {
            if (!bounds) return listings;
            return listings.filter(l => {
                if (!l.lat || !l.lng) return false;
                return bounds.contains([l.lat, l.lng]);
            });
        }
    };

    window.AHSS.map.geoSync = geo;
})();