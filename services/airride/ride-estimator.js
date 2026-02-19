// services/airride/ride-estimator.js
// Ride estimation – distance, time, cost for AirRide services

window.AHSS = window.AHSS || {};
window.AHSS.services = window.AHSS.services || {};
window.AHSS.services.airride = window.AHSS.services.airride || {};

(function() {
    // Base rates per km for different vehicle types
    const RATES = {
        standard: 1.5,
        premium: 2.5,
        van: 3.0,
        luxury: 4.0
    };

    // Estimate distance using haversine (or use map distance calculator)
    function estimateDistance(pickupLat, pickupLng, dropoffLat, dropoffLng) {
        if (window.AHSS.map && window.AHSS.map.distance) {
            return window.AHSS.map.distance.haversine(pickupLat, pickupLng, dropoffLat, dropoffLng);
        }
        // Fallback simple calculation (not accurate)
        const R = 6371;
        const dLat = (dropoffLat - pickupLat) * Math.PI / 180;
        const dLon = (dropoffLng - pickupLng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(pickupLat * Math.PI / 180) * Math.cos(dropoffLat * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Estimate fare
    function estimateFare(distanceKm, vehicleType = 'standard', waitingMinutes = 0) {
        const rate = RATES[vehicleType] || RATES.standard;
        let fare = distanceKm * rate;
        // Waiting time charge ($0.5 per minute)
        fare += waitingMinutes * 0.5;
        // Minimum fare
        return Math.max(5, Math.round(fare * 100) / 100);
    }

    // Estimate duration (assuming average speed 30 km/h)
    function estimateDuration(distanceKm, trafficFactor = 1.0) {
        const speed = 30 / trafficFactor; // km/h
        const hours = distanceKm / speed;
        const minutes = Math.round(hours * 60);
        return minutes;
    }

    // Get available vehicle types
    function getVehicleTypes() {
        return Object.keys(RATES).map(key => ({ id: key, rate: RATES[key] }));
    }

    window.AHSS.services.airride.rideEstimator = {
        estimateDistance,
        estimateFare,
        estimateDuration,
        getVehicleTypes
    };
})();