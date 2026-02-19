// js/map/clustering.js
// Marker clustering using Leaflet.markercluster (if available) or custom logic

window.AHSS = window.AHSS || {};
window.AHSS.map = window.AHSS.map || {};

(function() {
    // Check if Leaflet markercluster is loaded
    const hasClusterPlugin = typeof L.markerClusterGroup === 'function';

    const clustering = {
        clusterGroup: null,
        enabled: true,

        init: function(mapInstance) {
            if (!mapInstance) return;
            if (hasClusterPlugin) {
                this.clusterGroup = L.markerClusterGroup({
                    maxClusterRadius: window.AHSS.config?.ui?.mapClusterRadius || 50,
                    iconCreateFunction: function(cluster) {
                        const count = cluster.getChildCount();
                        return L.divIcon({
                            html: `<div class="marker-cluster">${count}</div>`,
                            className: 'marker-cluster-custom',
                            iconSize: [40, 40]
                        });
                    }
                });
                mapInstance.addLayer(this.clusterGroup);
            } else {
                console.warn('MarkerCluster plugin not loaded, clustering disabled');
                this.enabled = false;
            }
        },

        // Add markers to cluster
        addMarkers: function(markers) {
            if (!this.clusterGroup || !this.enabled) return;
            markers.forEach(m => this.clusterGroup.addLayer(m));
        },

        clear: function() {
            if (this.clusterGroup) this.clusterGroup.clearLayers();
        }
    };

    window.AHSS.map.clustering = clustering;
})();