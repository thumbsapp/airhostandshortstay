// js/search/filters.js
// Filter sidebar logic: price range, incentive score, tiers, amenities, radius, clear/apply

window.AHSS = window.AHSS || {};
window.AHSS.search = window.AHSS.search || {};

(function() {
    const filters = {
        elements: {},

        init: function() {
            this.cacheElements();
            this.setupEventListeners();
            this.loadFromState();
        },

        cacheElements: function() {
            this.elements = {
                priceRange: document.getElementById('price-range'),
                priceMinDisplay: document.getElementById('price-min-display'),
                priceMaxDisplay: document.getElementById('price-max-display'),
                incentiveScore: document.getElementById('incentive-score-filter'),
                tierBadges: document.querySelectorAll('.tier-badges span'),
                amenities: document.querySelectorAll('.amenities span'),
                radius: document.getElementById('radius-filter'),
                radiusDisplay: document.getElementById('radius-display'),
                clearBtn: document.getElementById('clear-filters'),
                applyBtn: document.getElementById('apply-filters')
            };
        },

        setupEventListeners: function() {
            if (this.elements.priceRange) {
                this.elements.priceRange.addEventListener('input', () => this.updatePriceDisplay());
                this.elements.priceRange.addEventListener('change', () => this.filterChange());
            }

            if (this.elements.incentiveScore) {
                this.elements.incentiveScore.addEventListener('change', () => this.filterChange());
            }

            if (this.elements.tierBadges) {
                this.elements.tierBadges.forEach(badge => {
                    badge.addEventListener('click', () => {
                        badge.classList.toggle('active');
                        this.filterChange();
                    });
                });
            }

            if (this.elements.amenities) {
                this.elements.amenities.forEach(amenity => {
                    amenity.addEventListener('click', () => {
                        amenity.classList.toggle('active');
                        this.filterChange();
                    });
                });
            }

            if (this.elements.radius) {
                this.elements.radius.addEventListener('input', () => {
                    if (this.elements.radiusDisplay) {
                        this.elements.radiusDisplay.textContent = this.elements.radius.value + ' km';
                    }
                });
                this.elements.radius.addEventListener('change', () => this.filterChange());
            }

            if (this.elements.clearBtn) {
                this.elements.clearBtn.addEventListener('click', () => this.clearFilters());
            }

            if (this.elements.applyBtn) {
                this.elements.applyBtn.addEventListener('click', () => this.applyFilters());
            }
        },

        updatePriceDisplay: function() {
            if (!this.elements.priceRange) return;
            const val = this.elements.priceRange.value;
            if (this.elements.priceMinDisplay) this.elements.priceMinDisplay.textContent = '$0';
            if (this.elements.priceMaxDisplay) this.elements.priceMaxDisplay.textContent = '$' + val;
        },

        filterChange: function() {
            // Auto-apply if realtime (could be debounced)
            // For now we just update state on apply button, but we can also call applyFilters here if needed
        },

        getCurrentFilters: function() {
            const filters = {};

            // Price
            if (this.elements.priceRange) {
                const priceMax = parseInt(this.elements.priceRange.value);
                filters.priceMin = 0;
                filters.priceMax = priceMax;
            }

            // Incentive score
            if (this.elements.incentiveScore) {
                const score = parseInt(this.elements.incentiveScore.value);
                if (score > 0) filters.incentiveScoreMin = score;
            }

            // Tiers
            const selectedTiers = [];
            if (this.elements.tierBadges) {
                this.elements.tierBadges.forEach(badge => {
                    if (badge.classList.contains('active')) {
                        selectedTiers.push(badge.dataset.tier);
                    }
                });
            }
            if (selectedTiers.length) filters.tiers = selectedTiers;

            // Amenities
            const selectedAmenities = [];
            if (this.elements.amenities) {
                this.elements.amenities.forEach(amenity => {
                    if (amenity.classList.contains('active')) {
                        selectedAmenities.push(amenity.dataset.amenity);
                    }
                });
            }
            if (selectedAmenities.length) filters.amenities = selectedAmenities;

            // Radius
            if (this.elements.radius) {
                filters.radius = parseInt(this.elements.radius.value);
            }

            return filters;
        },

        applyFilters: function() {
            const filters = this.getCurrentFilters();
            // Update state-manager
            if (window.AHSS.state) {
                Object.keys(filters).forEach(key => {
                    window.AHSS.state.setFilter(key, filters[key]);
                });
            }
            // Trigger re-render of listings (listings.js will listen to state change)
            console.log('Filters applied', filters);
        },

        clearFilters: function() {
            // Reset UI
            if (this.elements.priceRange) this.elements.priceRange.value = 500;
            this.updatePriceDisplay();
            if (this.elements.incentiveScore) this.elements.incentiveScore.value = '0';
            if (this.elements.tierBadges) {
                this.elements.tierBadges.forEach(b => b.classList.remove('active'));
            }
            if (this.elements.amenities) {
                this.elements.amenities.forEach(a => a.classList.remove('active'));
            }
            if (this.elements.radius) {
                this.elements.radius.value = 20;
                if (this.elements.radiusDisplay) this.elements.radiusDisplay.textContent = '20 km';
            }

            // Reset state filters
            if (window.AHSS.state) {
                window.AHSS.state.resetFilters();
            }
        },

        loadFromState: function() {
            // Sync UI with existing state filters
            if (!window.AHSS.state) return;
            const stateFilters = window.AHSS.state.filters || {};

            if (stateFilters.priceMax !== undefined && this.elements.priceRange) {
                this.elements.priceRange.value = stateFilters.priceMax;
                this.updatePriceDisplay();
            }
            if (stateFilters.incentiveScoreMin !== undefined && this.elements.incentiveScore) {
                this.elements.incentiveScore.value = stateFilters.incentiveScoreMin;
            }
            if (stateFilters.tiers && this.elements.tierBadges) {
                this.elements.tierBadges.forEach(b => {
                    if (stateFilters.tiers.includes(b.dataset.tier)) b.classList.add('active');
                });
            }
            if (stateFilters.amenities && this.elements.amenities) {
                this.elements.amenities.forEach(a => {
                    if (stateFilters.amenities.includes(a.dataset.amenity)) a.classList.add('active');
                });
            }
            if (stateFilters.radius && this.elements.radius) {
                this.elements.radius.value = stateFilters.radius;
                if (this.elements.radiusDisplay) this.elements.radiusDisplay.textContent = stateFilters.radius + ' km';
            }
        }
    };

    window.AHSS.search.filters = filters;

    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.filters-sidebar')) {
            filters.init();
        }
    });
})();