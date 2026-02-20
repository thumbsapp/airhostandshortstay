// js/data/data.js
// DATA.JS – Core data access layer, fetches and provides listings and incentives

window.AHSS = window.AHSS || {};

(function() {
    // Private data holder
    let _listings = [];
    let _incentives = [];
    let _bookings = [];
    
    window.AHSS.data = {
        // Fetch listings (from cache or API)
        fetchListings: async function(forceRefresh = false) {
            // Try cache first
            if (!forceRefresh) {
                const cached = window.AHSS.cache?.getListings();
                if (cached && cached.length) {
                    _listings = cached;
                    return _listings;
                }
            }
            
            // Otherwise fetch from API (simulated)
            try {
                const listings = await window.AHSS.api.getListings();
                _listings = listings;
                window.AHSS.cache?.saveListings(listings);
                return listings;
            } catch (error) {
                console.error('Failed to fetch listings', error);
                // Fallback to mock data
                const mock = window.AHSS.mockData?.getListings() || [];
                _listings = mock;
                return mock;
            }
        },
        
        getListings: function() {
            return _listings;
        },
        
        getListingById: function(id) {
            return _listings.find(l => l.id == id);
        },
        
        // Incentives
        fetchIncentives: async function() {
            const cached = window.AHSS.cache?.getIncentives();
            if (cached) {
                _incentives = cached;
                return cached;
            }
            const incentives = await window.AHSS.api.getIncentives().catch(() => window.AHSS.mockData?.getIncentives() || []);
            _incentives = incentives;
            window.AHSS.cache?.saveIncentives(incentives);
            return incentives;
        },
        
        getIncentivesForListing: function(listingId) {
            return _incentives.filter(inc => inc.listingId == listingId);
        },
        
        // Bookings (for dashboard)
        fetchBookings: async function(userId, role) {
            // role: 'host' or 'guest'
            return window.AHSS.api.getBookings(userId, role).catch(() => window.AHSS.mockData?.getBookings(userId, role) || []);
        },
        
        // Disputes
        fetchDisputes: async function(userId) {
            return window.AHSS.api.getDisputes(userId).catch(() => []);
        },
        
        // Create a new booking (simulated)
        createBooking: async function(bookingData) {
            // Would POST to API
            console.log('Creating booking', bookingData);
            // Simulate success
            return { success: true, bookingId: Date.now() };
        }
    };
})();