// js/data/caching.js
// CACHING.JS – LocalStorage caching for listings, incentives, wishlist, comparison, and state

window.AHSS = window.AHSS || {};

(function() {
    const storage = window.localStorage;
    const keys = window.AHSS.config?.storageKeys || {
        wishlist: 'ahss_wishlist',
        comparison: 'ahss_comparison',
        recentSearches: 'ahss_recent_searches',
        userPreferences: 'ahss_preferences',
        cachedListings: 'ahss_cached_listings',
        cachedIncentives: 'ahss_cached_incentives',
        appState: 'ahss_app_state'
    };
    
    // Helper to safely parse JSON
    function getItem(key, defaultValue = null) {
        try {
            const item = storage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn(`Failed to parse ${key} from localStorage`, e);
            return defaultValue;
        }
    }
    
    function setItem(key, value) {
        try {
            storage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn(`Failed to save ${key} to localStorage`, e);
        }
    }
    
    window.AHSS.cache = {
        // Wishlist
        getWishlist: function() {
            return getItem(keys.wishlist, []);
        },
        saveWishlist: function(wishlist) {
            setItem(keys.wishlist, wishlist);
        },
        
        // Comparison
        getComparison: function() {
            return getItem(keys.comparison, []);
        },
        saveComparison: function(comparison) {
            setItem(keys.comparison, comparison);
        },
        
        // Recent searches
        getRecentSearches: function() {
            return getItem(keys.recentSearches, []);
        },
        addRecentSearch: function(searchQuery) {
            let searches = this.getRecentSearches();
            searches = [searchQuery, ...searches.filter(s => s !== searchQuery)].slice(0, 10);
            setItem(keys.recentSearches, searches);
            return searches;
        },
        
        // Listings cache (with timestamp)
        getListings: function() {
            const cached = getItem(keys.cachedListings);
            if (cached && cached.timestamp && (Date.now() - cached.timestamp < 3600000)) { // 1 hour
                return cached.data;
            }
            return null;
        },
        saveListings: function(listings) {
            setItem(keys.cachedListings, {
                timestamp: Date.now(),
                data: listings
            });
        },
        
        // Incentives cache
        getIncentives: function() {
            const cached = getItem(keys.cachedIncentives);
            if (cached && cached.timestamp && (Date.now() - cached.timestamp < 3600000)) {
                return cached.data;
            }
            return null;
        },
        saveIncentives: function(incentives) {
            setItem(keys.cachedIncentives, {
                timestamp: Date.now(),
                data: incentives
            });
        },
        
        // App state (filters, sort, etc.)
        getState: function() {
            return getItem(keys.appState, {});
        },
        saveState: function(state) {
            setItem(keys.appState, {
                timestamp: Date.now(),
                data: state
            });
        },
        
        // Load all cached data into memory (called by app init)
        loadCachedData: function() {
            const state = this.getState();
            if (state.data) {
                // Will be used by state-manager
                return state.data;
            }
            return null;
        },
        
        // User preferences
        getUserPreferences: function() {
            return getItem(keys.userPreferences, { currency: 'USD', language: 'en' });
        },
        saveUserPreferences: function(prefs) {
            setItem(keys.userPreferences, prefs);
        },
        
        // Clear all caches (for debugging)
        clearAll: function() {
            Object.values(keys).forEach(key => storage.removeItem(key));
        }
    };
})();