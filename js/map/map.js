// js/map/map.js
// Core map module – initializes Leaflet map, manages markers, layers, and interactions

window.AHSS = window.AHSS || {};
window.AHSS.map = window.AHSS.map || {};

(function() {
    const config = window.AHSS.config?.map || {
        defaultCenter: { lat: -1.286, lng: 36.817 },
        defaultZoom: 12,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors'
    };

    let mapInstance = null;
    let markerLayer = null; // Layer group for markers
    let clusterGroup = null; // For clustering if enabled
    let currentMarkers = [];

    const mapModule = {
        // Initialize map on a given container id
        init: function(containerId, options = {}) {
            if (!containerId) return null;
            const container = document.getElementById(containerId);
            if (!container) return null;

            mapInstance = L.map(container, {
                center: [options.center?.lat || config.defaultCenter.lat, options.center?.lng || config.defaultCenter.lng],
                zoom: options.zoom || config.defaultZoom,
                ...options
            });

            L.tileLayer(config.tileLayer, {
                attribution: config.attribution
            }).addTo(mapInstance);

            // Create layer groups
            markerLayer = L.layerGroup().addTo(mapInstance);
            clusterGroup = L.markerClusterGroup ? L.markerClusterGroup() : null; // if plugin loaded

            // Add controls if needed
            this.addControls();

            // Listen to state changes to update markers
            window.AHSS.app?.on(window.AHSS.constants.EVENTS.LISTINGS_UPDATED, (listings) => {
                this.updateMarkers(listings);
            });

            // Map move/zoom events for viewport filtering
            mapInstance.on('moveend', () => {
                const bounds = mapInstance.getBounds();
                window.AHSS.state && (window.AHSS.state.mapBounds = bounds);
                window.AHSS.app?.emit('map_bounds_changed', bounds);
            });

            return mapInstance;
        },

        addControls: function() {
            // Add custom recenter button
            const recenterBtn = document.getElementById('recenter-btn');
            if (recenterBtn) {
                recenterBtn.addEventListener('click', () => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(pos => {
                            mapInstance.setView([pos.coords.latitude, pos.coords.longitude], 14);
                        }, () => {
                            mapInstance.setView([config.defaultCenter.lat, config.defaultCenter.lng], config.defaultZoom);
                        });
                    } else {
                        mapInstance.setView([config.defaultCenter.lat, config.defaultCenter.lng], config.defaultZoom);
                    }
                });
            }

            // Fullscreen toggle
            const fullscreenBtn = document.getElementById('fullscreen-btn');
            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', () => {
                    const mapPanel = document.querySelector('.map-panel');
                    if (mapPanel) {
                        mapPanel.classList.toggle('fullscreen');
                    }
                });
            }
        },

        // Update markers based on listings array
        updateMarkers: function(listings) {
            if (!mapInstance) return;
            // Clear existing markers
            markerLayer.clearLayers();
            currentMarkers = [];

            if (!listings || listings.length === 0) return;

            // Create markers for each listing
            listings.forEach(listing => {
                if (!listing.lat || !listing.lng) return;
                const marker = this.createMarker(listing);
                marker.addTo(markerLayer);
                currentMarkers.push(marker);
            });

            // If clustering is enabled and clusterGroup exists, use it instead
            if (clusterGroup) {
                clusterGroup.clearLayers();
                clusterGroup.addLayer(markerLayer);
                mapInstance.addLayer(clusterGroup);
            }
        },

        // Create a marker with custom price pin and popup
        createMarker: function(listing) {
            const price = listing.price;
            const tierColor = listing.tier === 'Diamond' ? '#a855f7' : (listing.tier === 'Gold' ? '#f59e0b' : '#10b981');
            const availabilityColor = listing.availability === 'available' ? '#10b981' : (listing.availability === 'almost_gone' ? '#f59e0b' : '#ef4444');

            // Custom icon: a small bubble with price
            const icon = L.divIcon({
                html: `<div class="price-pin" style="background:${availabilityColor}; color:#0f172a; border-radius:40px; padding:4px 10px; font-weight:bold; border:2px solid white; box-shadow:0 2px 8px #000;">$${price}</div>`,
                className: '',
                iconSize: [70, 30],
                iconAnchor: [35, 15]
            });

            const marker = L.marker([listing.lat, listing.lng], { icon });

            // Popup with details
            const popupContent = `
                <div style="min-width:200px;">
                    <img src="${listing.images?.[0] || 'https://picsum.photos/200/100'}" style="width:100%; border-radius:12px;">
                    <h4>${listing.title}</h4>
                    <div>$${listing.price}/night · ⭐ ${listing.rating || 'New'}</div>
                    <div style="display:flex; gap:4px; margin-top:4px;">
                        <span class="popup-badge">🎁 $${listing.bonusValue || 0}</span>
                        <span class="popup-badge">${listing.tier || 'Standard'}</span>
                    </div>
                    <button class="btn-small" onclick="window.AHSS.state.selectedProperty = window.AHSS.data.getListingById(${listing.id})">View</button>
                </div>
            `;
            marker.bindPopup(popupContent);

            // Marker click event: also emit for preview
            marker.on('click', () => {
                window.AHSS.state.selectedProperty = listing;
            });

            return marker;
        },

        // Get current map instance
        getMap: function() {
            return mapInstance;
        },

        // Pan to a specific listing
        panToListing: function(listingId) {
            const listing = window.AHSS.data?.getListingById(listingId);
            if (listing && mapInstance) {
                mapInstance.setView([listing.lat, listing.lng], 15);
            }
        }
    };

    window.AHSS.map.core = mapModule;
})();