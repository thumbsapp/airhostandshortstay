// js/core/config.js
// CONFIG.JS – Global configuration settings for AirHost&ShortStay

window.AHSS = window.AHSS || {};

window.AHSS.config = {
    // App metadata
    appName: 'AirHost&ShortStay',
    version: '1.0.0',
    
    // API endpoints (simulated, will be used by api-adapter)
    apiBase: 'https://api.airhostandshortstay.com/v1',
    endpoints: {
        listings: '/listings',
        incentives: '/incentives',
        bookings: '/bookings',
        users: '/users',
        disputes: '/disputes',
        transactions: '/transactions'
    },
    
    // Map defaults
    map: {
        defaultCenter: { lat: -1.286, lng: 36.817 }, // Nairobi
        defaultZoom: 12,
        maxZoom: 18,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors'
    },
    
    // Feature flags (enable/disable parts of the UI)
    features: {
        incentiveEngine: true,
        lipaMdogo: true,
        negotiation: true,
        airChef: true,
        airRide: true,
        airRelax: true,
        airDuka: true,
        comparison: true,
        wishlist: true,
        realtimeUpdates: false,   // would require WebSocket, disabled for static demo
        fraudDetection: true,
        escrowProtection: true
    },
    
    // Filter defaults
    filters: {
        priceMin: 0,
        priceMax: 1000,
        radiusKm: 20,
        incentiveScoreMin: 0,
        tiers: ['Silver', 'Gold', 'Diamond'],
        amenities: []
    },
    
    // UI configuration
    ui: {
        itemsPerPage: 12,
        maxCompareItems: 4,
        maxWishlistItems: 5,
        carouselItemCount: 6,
        animationDuration: 300,
        mapClusterRadius: 50
    },
    
    // Incentive scoring weights (for incentive.score.js)
    incentiveWeights: {
        financial: 0.3,
        physical: 0.2,
        experience: 0.2,
        occasion: 0.15,
        business: 0.15
    },
    
    // Fraud prevention limits
    fraud: {
        maxCashbackPercent: 20,
        maxStackableIncentives: 2,
        maxRedemptionsPerMonth: 3,
        flagHighRiskScore: 70 // if fraud risk score > 70, show warning
    },
    
    // Local storage keys
    storageKeys: {
        wishlist: 'ahss_wishlist',
        comparison: 'ahss_comparison',
        recentSearches: 'ahss_recent_searches',
        userPreferences: 'ahss_preferences',
        cachedListings: 'ahss_cached_listings',
        cachedIncentives: 'ahss_cached_incentives'
    }
};

// Helper to get config value
window.AHSS.getConfig = function(key) {
    return key.split('.').reduce((obj, i) => obj?.[i], window.AHSS.config);
};