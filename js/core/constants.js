// js/core/constants.js
// CONSTANTS.JS – Enumerations and constant values used across the app

window.AHSS = window.AHSS || {};

window.AHSS.constants = {
    // Incentive categories (must match config weights)
    INCENTIVE_CATEGORIES: {
        FINANCIAL: 'financial',
        PHYSICAL: 'physical',
        EXPERIENCE: 'experience',
        OCCASION: 'occasion',
        BUSINESS: 'business'
    },
    
    // Tier types
    TIERS: {
        SILVER: 'Silver',
        GOLD: 'Gold',
        DIAMOND: 'Diamond'
    },
    
    // Availability status (for map pins and cards)
    AVAILABILITY: {
        AVAILABLE: 'available',      // green
        ALMOST_GONE: 'almost_gone',  // orange/amber
        BOOKED: 'booked'             // red
    },
    
    // Property types
    PROPERTY_TYPES: {
        VILLA: 'villa',
        APARTMENT: 'apartment',
        HOUSE: 'house',
        PENTHOUSE: 'penthouse',
        COTTAGE: 'cottage'
    },
    
    // Amenities list (standardized)
    AMENITIES: {
        WIFI: 'wifi',
        POOL: 'pool',
        KITCHEN: 'kitchen',
        AIR_CONDITIONING: 'ac',
        PARKING: 'parking',
        PET_FRIENDLY: 'pets',
        SMOKING_ALLOWED: 'smoking',
        HOT_TUB: 'hot_tub',
        GYM: 'gym',
        BEACHFRONT: 'beachfront'
    },
    
    // Service types (AirChef, AirRide, etc.)
    SERVICES: {
        AIR_CHEF: 'airchef',
        AIR_RIDE: 'airride',
        AIR_RELAX: 'airrelax',
        AIR_DUKA: 'airduka'
    },
    
    // Filter parameter keys (used in URLs and state)
    FILTER_KEYS: {
        PRICE_MIN: 'price_min',
        PRICE_MAX: 'price_max',
        INCENTIVE_SCORE_MIN: 'incentive_min',
        TIERS: 'tiers',
        AMENITIES: 'amenities',
        RADIUS: 'radius',
        GUESTS: 'guests',
        DATES: 'dates',
        BEDROOMS: 'bedrooms',
        BATHROOMS: 'bathrooms',
        INSTANT_BOOK: 'instant_book',
        FREE_CANCELLATION: 'free_cancel'
    },
    
    // Sort options
    SORT_OPTIONS: {
        RECOMMENDED: 'recommended',
        PRICE_LOW: 'price_asc',
        PRICE_HIGH: 'price_desc',
        INCENTIVE_SCORE: 'incentive_desc',
        RATING: 'rating_desc',
        DISTANCE: 'distance_asc'
    },
    
    // Event names (for pub/sub or state change)
    EVENTS: {
        LISTINGS_UPDATED: 'listings_updated',
        FILTERS_CHANGED: 'filters_changed',
        MAP_BOUNDS_CHANGED: 'map_bounds_changed',
        WISHLIST_UPDATED: 'wishlist_updated',
        COMPARISON_UPDATED: 'comparison_updated',
        SELECTED_PROPERTY_CHANGED: 'selected_property_changed',
        INCENTIVE_FILTER_CHANGED: 'incentive_filter_changed',
        BOOKING_INITIATED: 'booking_initiated'
    },
    
    // Currency & language
    CURRENCIES: {
        USD: { code: 'USD', symbol: '$', rate: 1 },
        EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
        KES: { code: 'KES', symbol: 'KSh', rate: 130 }
    },
    
    LANGUAGES: {
        EN: 'en',
        SW: 'sw',
        FR: 'fr'
    },
    
    // Real-time badge messages
    REAL_TIME_MESSAGES: [
        '⚡ 3 people booked in last 5 minutes',
        '⚡ 2 guests just booked Sunset Villa',
        '🔥 5 people viewing this property',
        '⏳ Only 2 left at this price',
        '💰 Price dropped $20 today'
    ]
};