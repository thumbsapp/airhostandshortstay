// services/airride/airport-transfer.js
// Specialized airport transfer logic – flat rates, meet & greet, etc.

window.AHSS = window.AHSS || {};
window.AHSS.services = window.AHSS.services || {};
window.AHSS.services.airride = window.AHSS.services.airride || {};

(function() {
    // Airport codes with flat rates (example)
    const AIRPORT_FLAT_RATES = {
        NBO: { toCity: 25, fromCity: 25, currency: 'USD' },
        MBA: { toCity: 20, fromCity: 20 },
        KIS: { toCity: 15, fromCity: 15 }
    };

    // Get flat rate for airport transfer
    function getFlatRate(airportCode, direction = 'toCity') {
        const airport = AIRPORT_FLAT_RATES[airportCode.toUpperCase()];
        if (!airport) return null;
        return airport[direction] || null;
    }

    // Calculate airport transfer price
    function calculatePrice(airportCode, pickupLat, pickupLng, useFlatRate = true) {
        if (useFlatRate) {
            const flat = getFlatRate(airportCode);
            if (flat) return flat;
        }
        // Fallback to regular ride estimator
        // Assume airport coordinates (simplified – would need actual lat/lng per airport)
        const airportCoords = { NBO: [-1.319, 36.927], MBA: [-4.034, 39.594], KIS: [-0.086, 34.729] };
        const coords = airportCoords[airportCode.toUpperCase()];
        if (!coords) return null;
        const distance = window.AHSS.services.airride.rideEstimator.estimateDistance(
            pickupLat, pickupLng, coords[0], coords[1]
        );
        return window.AHSS.services.airride.rideEstimator.estimateFare(distance, 'premium');
    }

    // Meet & greet service options
    function getMeetAndGreetOptions() {
        return [
            { id: 'basic', name: 'Standard meet & greet', price: 5 },
            { id: 'priority', name: 'Priority with luggage assistance', price: 12 },
            { id: 'vip', name: 'VIP lounge access', price: 30 }
        ];
    }

    window.AHSS.services.airride.airportTransfer = {
        getFlatRate,
        calculatePrice,
        getMeetAndGreetOptions
    };
})();