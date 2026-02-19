// listings/meta-aggregation/external-source-adapter.js
// Adapter to normalize external listing data into internal format

window.AHSS = window.AHSS || {};
window.AHSS.listings = window.AHSS.listings || {};
window.AHSS.listings.meta = window.AHSS.listings.meta || {};

(function() {
    // Map external source fields to internal schema
    function adaptAirbnb(listing) {
        return {
            id: listing.id,
            title: listing.name,
            price: listing.price,
            lat: listing.lat,
            lng: listing.lng,
            images: listing.images,
            amenities: listing.amenities,
            rating: listing.review_scores_rating / 20, // normalize to 5-star
            reviewCount: listing.number_of_reviews,
            source: 'aggregated',
            originalSource: 'airbnb'
        };
    }

    function adaptBookingCom(listing) {
        return {
            id: listing.hotel_id,
            title: listing.hotel_name,
            price: listing.min_total_price,
            lat: listing.latitude,
            lng: listing.longitude,
            images: listing.main_photo_url ? [listing.main_photo_url] : [],
            amenities: listing.facilities || [],
            rating: listing.review_score,
            reviewCount: listing.review_nr,
            source: 'aggregated',
            originalSource: 'booking'
        };
    }

    // Generic adapter that tries to detect source
    function adapt(listing) {
        if (listing.review_scores_rating !== undefined) {
            return adaptAirbnb(listing);
        } else if (listing.hotel_id !== undefined) {
            return adaptBookingCom(listing);
        } else {
            // Fallback: assume already in internal format
            return listing;
        }
    }

    window.AHSS.listings.meta.externalAdapter = {
        adaptAirbnb,
        adaptBookingCom,
        adapt
    };
})();