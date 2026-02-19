// js/data/mock-data.js
// MOCK-DATA.JS – Mock listings, incentives, users for demo/testing

window.AHSS = window.AHSS || {};

(function() {
    const mockListings = [
        {
            id: 1,
            title: 'Sunset Beach Villa',
            description: 'Luxurious beachfront villa with private pool',
            price: 180,
            priceCrossed: 220, // original price for savings display
            location: 'Nairobi', // simplified, but would have lat/lng
            lat: -1.286,
            lng: 36.817,
            rating: 4.8,
            reviewCount: 124,
            guests: 4,
            bedrooms: 2,
            bathrooms: 2,
            amenities: ['wifi', 'pool', 'kitchen', 'airchef'],
            tier: 'Diamond',
            incentiveScore: 92,
            bonusValue: 45,
            cashback: '10%',
            availability: 'available', // green
            images: ['https://picsum.photos/400/300?random=1'],
            host: {
                id: 101,
                name: 'Jane Doe',
                verified: true,
                trustScore: 98
            },
            incentives: [
                { type: 'financial', value: 45, description: 'Cashback at check-in' },
                { type: 'physical', value: 25, description: 'Free spa kit' }
            ],
            fraudRiskScore: 12 // low
        },
        {
            id: 2,
            title: 'Penthouse Langata',
            description: 'Modern penthouse with city views',
            price: 250,
            priceCrossed: 300,
            lat: -1.332,
            lng: 36.722,
            rating: 4.9,
            reviewCount: 87,
            guests: 6,
            bedrooms: 3,
            bathrooms: 2,
            amenities: ['wifi', 'gym', 'airride'],
            tier: 'Gold',
            incentiveScore: 88,
            bonusValue: 60,
            cashback: '5%',
            availability: 'almost_gone', // amber
            images: ['https://picsum.photos/400/300?random=2'],
            host: { id: 102, name: 'John Smith', verified: true, trustScore: 95 },
            incentives: [
                { type: 'financial', value: 60, description: 'Airport transfer discount' },
                { type: 'experience', value: 30, description: 'City tour voucher' }
            ],
            fraudRiskScore: 8
        },
        {
            id: 3,
            title: 'Pool House Kilimani',
            price: 150,
            priceCrossed: 180,
            lat: -1.292,
            lng: 36.785,
            rating: 4.5,
            reviewCount: 56,
            guests: 4,
            bedrooms: 2,
            bathrooms: 1,
            amenities: ['wifi', 'pool'],
            tier: 'Silver',
            incentiveScore: 76,
            bonusValue: 30,
            availability: 'booked', // red
            images: ['https://picsum.photos/400/300?random=3'],
            host: { id: 103, name: 'Alice Kim', verified: false, trustScore: 80 },
            incentives: [],
            fraudRiskScore: 25
        },
        {
            id: 4,
            title: 'Villa Mombasa',
            price: 320,
            priceCrossed: 400,
            lat: -4.043,
            lng: 39.668,
            rating: 5.0,
            reviewCount: 32,
            guests: 8,
            bedrooms: 4,
            bathrooms: 3,
            amenities: ['wifi', 'pool', 'beachfront', 'airrelax'],
            tier: 'Diamond',
            incentiveScore: 95,
            bonusValue: 80,
            cashback: '15%',
            availability: 'available',
            images: ['https://picsum.photos/400/300?random=4'],
            host: { id: 104, name: 'Mombasa Luxury', verified: true, trustScore: 99 },
            incentives: [
                { type: 'financial', value: 80, description: '15% cashback' },
                { type: 'physical', value: 50, description: 'Spa package' },
                { type: 'experience', value: 100, description: 'Sunset cruise' }
            ],
            fraudRiskScore: 5
        },
        {
            id: 5,
            title: 'Cozy Cottage Thika',
            price: 90,
            lat: -1.045,
            lng: 37.083,
            rating: 4.2,
            reviewCount: 18,
            guests: 2,
            bedrooms: 1,
            bathrooms: 1,
            amenities: ['wifi', 'kitchen'],
            tier: 'Silver',
            incentiveScore: 65,
            bonusValue: 15,
            availability: 'available',
            images: ['https://picsum.photos/400/300?random=5'],
            host: { id: 105, name: 'Thika Retreats', verified: false, trustScore: 70 },
            incentives: [],
            fraudRiskScore: 10
        }
    ];
    
    const mockIncentives = [
        { id: 1001, listingId: 1, type: 'financial', category: 'financial', title: 'Cashback $45', value: 45, stackable: true, maxRedemptions: 100, expires: '2026-12-31' },
        { id: 1002, listingId: 1, type: 'spa', category: 'physical', title: 'Free spa kit', value: 25, stackable: true },
        { id: 1003, listingId: 2, type: 'transfer', category: 'financial', title: 'Airport transfer discount', value: 60, stackable: false },
        { id: 1004, listingId: 2, type: 'tour', category: 'experience', title: 'City tour voucher', value: 30 },
        { id: 1005, listingId: 4, type: 'cashback', category: 'financial', title: '15% cashback', value: 80 },
        { id: 1006, listingId: 4, type: 'spa', category: 'physical', title: 'Luxury spa package', value: 50 },
        { id: 1007, listingId: 4, type: 'cruise', category: 'experience', title: 'Sunset cruise', value: 100 }
    ];
    
    const mockUsers = [
        { id: 1001, name: 'Guest User', email: 'guest@example.com', role: 'guest' },
        { id: 2001, name: 'Host User', email: 'host@example.com', role: 'host' }
    ];
    
    const mockBookings = [
        { id: 5001, listingId: 1, guestId: 1001, hostId: 101, checkIn: '2026-05-05', checkOut: '2026-05-12', total: 1260, status: 'confirmed' }
    ];
    
    window.AHSS.mockData = {
        getListings: function() {
            return JSON.parse(JSON.stringify(mockListings)); // deep copy
        },
        getIncentives: function() {
            return JSON.parse(JSON.stringify(mockIncentives));
        },
        getUsers: function() {
            return JSON.parse(JSON.stringify(mockUsers));
        },
        getBookings: function(userId, role) {
            if (role === 'guest') {
                return mockBookings.filter(b => b.guestId == userId);
            } else if (role === 'host') {
                return mockBookings.filter(b => b.hostId == userId);
            }
            return [];
        }
    };
})();