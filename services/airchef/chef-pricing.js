// services/airchef/chef-pricing.js
// Dynamic pricing for AirChef (seasonal, discounts, etc.)

window.AHSS = window.AHSS || {};
window.AHSS.services = window.AHSS.services || {};
window.AHSS.services.airchef = window.AHSS.services.airchef || {};

(function() {
    // Apply seasonal multiplier (e.g., holidays)
    function seasonalMultiplier(date = new Date()) {
        const month = date.getMonth();
        // December high season
        if (month === 11) return 1.3;
        // July-August
        if (month >= 6 && month <= 7) return 1.2;
        return 1.0;
    }

    // Apply discount for long stays (e.g., 10% off for weekly)
    function longStayDiscount(price, nights) {
        if (nights >= 7) return price * 0.9;
        return price;
    }

    // Final price calculation
    function calculateFinalPrice(basePrice, guests, nights, date = new Date()) {
        let price = basePrice;
        price *= seasonalMultiplier(date);
        price = longStayDiscount(price, nights);
        // Round to nearest dollar
        return Math.round(price);
    }

    window.AHSS.services.airchef.pricing = {
        seasonalMultiplier,
        longStayDiscount,
        calculateFinalPrice
    };
})();