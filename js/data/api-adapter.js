// js/data/api-adapter.js
// API-ADAPTER.JS – Simulated API calls (fetch) with delay and error simulation

window.AHSS = window.AHSS || {};

(function() {
    const config = window.AHSS.config;
    const baseUrl = config?.apiBase || 'https://api.airhostandshortstay.com/v1';
    
    // Simulate network delay
    const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Helper to simulate success/failure
    const mockResponse = (data, shouldFail = false, failRate = 0.1) => {
        if (shouldFail || Math.random() < failRate) {
            throw new Error('Simulated API error');
        }
        return data;
    };
    
    window.AHSS.api = {
        // Listings
        getListings: async function(filters = {}) {
            await delay(600);
            // Return mock data from mock-data.js
            if (window.AHSS.mockData) {
                return mockResponse(window.AHSS.mockData.getListings());
            }
            return [];
        },
        
        getListing: async function(id) {
            await delay(300);
            const listings = window.AHSS.mockData?.getListings() || [];
            return mockResponse(listings.find(l => l.id == id));
        },
        
        // Incentives
        getIncentives: async function() {
            await delay(400);
            return mockResponse(window.AHSS.mockData?.getIncentives() || []);
        },
        
        getIncentivesForListing: async function(listingId) {
            await delay(200);
            const incentives = window.AHSS.mockData?.getIncentives() || [];
            return mockResponse(incentives.filter(i => i.listingId == listingId));
        },
        
        // Bookings
        getBookings: async function(userId, role) {
            await delay(500);
            return mockResponse(window.AHSS.mockData?.getBookings(userId, role) || []);
        },
        
        createBooking: async function(bookingData) {
            await delay(800);
            console.log('API: createBooking', bookingData);
            // simulate success
            return mockResponse({ success: true, bookingId: Math.floor(Math.random()*10000) });
        },
        
        // Negotiation (simulated)
        sendOffer: async function(listingId, offerPrice) {
            await delay(700);
            // random accept/reject
            const accepted = Math.random() > 0.3;
            return mockResponse({ accepted, counterOffer: accepted ? null : Math.round(offerPrice * 1.1) });
        },
        
        // Lipa Mdogo calculation
        calculateInstallments: async function(amount, months = 4) {
            await delay(300);
            const monthly = amount / months;
            return mockResponse({
                total: amount,
                months,
                monthly: Math.round(monthly * 100) / 100,
                schedule: Array.from({ length: months }, (_, i) => ({
                    due: `Month ${i+1}`,
                    amount: monthly
                }))
            });
        },
        
        // Disputes
        getDisputes: async function(userId) {
            await delay(500);
            return mockResponse([]); // no disputes by default
        },
        
        createDispute: async function(disputeData) {
            await delay(700);
            return mockResponse({ disputeId: Date.now(), status: 'opened' });
        },
        
        // Fraud check
        checkFraudRisk: async function(listingId) {
            await delay(200);
            const listing = (window.AHSS.mockData?.getListings() || []).find(l => l.id == listingId);
            return mockResponse({ riskScore: listing?.fraudRiskScore || 0, flagged: (listing?.fraudRiskScore || 0) > 70 });
        }
    };
})();