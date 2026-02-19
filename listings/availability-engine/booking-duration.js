// listings/availability-engine/booking-duration.js
// Calculate minimum/maximum stay, check-in/out rules

window.AHSS = window.AHSS || {};
window.AHSS.listings = window.AHSS.listings || {};
window.AHSS.listings.availability = window.AHSS.listings.availability || {};

(function() {
    function getMinStay(listing) {
        return listing.minStay || 1;
    }

    function getMaxStay(listing) {
        return listing.maxStay || 365;
    }

    function isAvailableForDates(listing, checkIn, checkOut) {
        // Simplified: assume availability object exists
        if (!listing.availabilityCalendar) return true;
        // In real app, would check calendar
        return true;
    }

    // Calculate number of nights
    function calculateNights(checkIn, checkOut) {
        const diff = checkOut - checkIn;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    window.AHSS.listings.availability.bookingDuration = {
        getMinStay,
        getMaxStay,
        isAvailableForDates,
        calculateNights
    };
})();