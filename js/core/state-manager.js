// js/core/state-manager.js
// STATE-MANAGER.JS – Central state management (listings, filters, UI state)

window.AHSS = window.AHSS || {};

(function() {
    const state = {
        // Data
        allListings: [],          // full unfiltered listings
        filteredListings: [],      // after applying filters
        selectedProperty: null,    // currently previewed property
        filters: {},               // current filter values
        sortBy: 'recommended',
        
        // UI state
        mapBounds: null,
        mapZoom: 12,
        mapCenter: null,
        
        // User-related
        wishlist: [],              // array of listing IDs
        comparison: [],            // array of listing IDs (max 4)
        recentSearches: [],
        
        // Incentive engine data
        incentives: [],
        fraudRiskScores: new Map(), // listing id -> score
        
        // Initialization flag
        initialized: false
    };
    
    // Getters and setters with change detection
    const handler = {
        get(target, prop) {
            return target[prop];
        },
        set(target, prop, value) {
            const old = target[prop];
            target[prop] = value;
            if (old !== value) {
                window.AHSS.app.emit('state_changed', { prop, value, old });
                // Emit specific events
                if (prop === 'filteredListings') {
                    window.AHSS.app.emit(window.AHSS.constants.EVENTS.LISTINGS_UPDATED, value);
                }
                if (prop === 'filters') {
                    window.AHSS.app.emit(window.AHSS.constants.EVENTS.FILTERS_CHANGED, value);
                }
                if (prop === 'wishlist') {
                    window.AHSS.app.emit(window.AHSS.constants.EVENTS.WISHLIST_UPDATED, value);
                }
                if (prop === 'comparison') {
                    window.AHSS.app.emit(window.AHSS.constants.EVENTS.COMPARISON_UPDATED, value);
                }
                if (prop === 'selectedProperty') {
                    window.AHSS.app.emit(window.AHSS.constants.EVENTS.SELECTED_PROPERTY_CHANGED, value);
                }
            }
            return true;
        }
    };
    
    const proxiedState = new Proxy(state, handler);
    
    window.AHSS.state = {
        ...proxiedState,
        
        // Initialize state from cache / defaults
        init: function() {
            if (this.initialized) return;
            
            // Load from cache
            const cached = window.AHSS.cache?.loadState();
            if (cached) {
                Object.assign(state, cached);
            }
            
            // Set default filters from config
            const configFilters = window.AHSS.config?.filters;
            if (configFilters) {
                state.filters = { ...configFilters };
            }
            
            // Load wishlist from localStorage
            const wishlist = window.AHSS.cache?.getWishlist() || [];
            state.wishlist = wishlist;
            
            // Load comparison
            const comparison = window.AHSS.cache?.getComparison() || [];
            state.comparison = comparison;
            
            // Load listings (from mock-data or API)
            if (window.AHSS.data) {
                window.AHSS.data.fetchListings().then(listings => {
                    state.allListings = listings;
                    this.applyFilters(); // initial filter
                });
            }
            
            this.initialized = true;
        },
        
        // Apply current filters to allListings, update filteredListings
        applyFilters: function() {
            if (!state.allListings.length) return;
            
            const filters = state.filters;
            let filtered = state.allListings.filter(listing => {
                // Price range
                if (filters.priceMin && listing.price < filters.priceMin) return false;
                if (filters.priceMax && listing.price > filters.priceMax) return false;
                
                // Incentive score
                if (filters.incentiveScoreMin && (listing.incentiveScore || 0) < filters.incentiveScoreMin) return false;
                
                // Tiers
                if (filters.tiers && filters.tiers.length && !filters.tiers.includes(listing.tier)) return false;
                
                // Amenities (if any filter selected, listing must have all)
                if (filters.amenities && filters.amenities.length) {
                    if (!listing.amenities) return false;
                    if (!filters.amenities.every(a => listing.amenities.includes(a))) return false;
                }
                
                // Radius (simplified – would need geo calculation)
                // This is a placeholder; actual would use distance from map center
                
                // Guests (if listing.guests)
                if (filters.guests && listing.guests < filters.guests) return false;
                
                return true;
            });
            
            // Apply sorting
            filtered = this.sortListings(filtered, state.sortBy);
            
            state.filteredListings = filtered;
            return filtered;
        },
        
        // Sort listings based on sortBy
        sortListings: function(listings, sortBy) {
            const sorted = [...listings];
            switch (sortBy) {
                case 'price_asc':
                    sorted.sort((a,b) => a.price - b.price);
                    break;
                case 'price_desc':
                    sorted.sort((a,b) => b.price - a.price);
                    break;
                case 'incentive_desc':
                    sorted.sort((a,b) => (b.incentiveScore || 0) - (a.incentiveScore || 0));
                    break;
                case 'rating_desc':
                    sorted.sort((a,b) => (b.rating || 0) - (a.rating || 0));
                    break;
                default: // recommended (default order)
                    // could be a mix of incentive, price, etc.
                    break;
            }
            return sorted;
        },
        
        // Update a single filter and reapply
        setFilter: function(key, value) {
            state.filters = { ...state.filters, [key]: value };
            this.applyFilters();
        },
        
        // Reset all filters to defaults
        resetFilters: function() {
            state.filters = { ...window.AHSS.config.filters };
            this.applyFilters();
        },
        
        // Add/remove from wishlist
        toggleWishlist: function(listingId) {
            let wishlist = [...state.wishlist];
            if (wishlist.includes(listingId)) {
                wishlist = wishlist.filter(id => id !== listingId);
            } else {
                if (wishlist.length >= window.AHSS.config.ui.maxWishlistItems) {
                    alert(`You can only pin up to ${window.AHSS.config.ui.maxWishlistItems} properties.`);
                    return;
                }
                wishlist.push(listingId);
            }
            state.wishlist = wishlist;
            window.AHSS.cache?.saveWishlist(wishlist);
            return wishlist;
        },
        
        // Add/remove from comparison
        toggleComparison: function(listingId) {
            let comp = [...state.comparison];
            if (comp.includes(listingId)) {
                comp = comp.filter(id => id !== listingId);
            } else {
                if (comp.length >= window.AHSS.config.ui.maxCompareItems) {
                    alert(`You can compare up to ${window.AHSS.config.ui.maxCompareItems} properties.`);
                    return;
                }
                comp.push(listingId);
            }
            state.comparison = comp;
            window.AHSS.cache?.saveComparison(comp);
            return comp;
        },
        
        // Persist state to cache (called before unload)
        persist: function() {
            window.AHSS.cache?.saveState({
                filters: state.filters,
                sortBy: state.sortBy,
                recentSearches: state.recentSearches,
                mapCenter: state.mapCenter,
                mapZoom: state.mapZoom
            });
        }
    };
})();