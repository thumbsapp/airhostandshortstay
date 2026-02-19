// pricing/negotiation-engine/counter-offer-logic.js
// Generate counter-offers based on host preferences and historical data

window.AHSS = window.AHSS || {};
window.AHSS.pricing = window.AHSS.pricing || {};
window.AHSS.pricing.negotiation = window.AHSS.pricing.negotiation || {};

(function() {
    // Generate a response to an offer (accept, reject, counter)
    function generateResponse(negotiation, offer) {
        const originalPrice = negotiation.originalPrice;
        const offerAmount = offer.amount;
        const diff = originalPrice - offerAmount;
        const percentOff = (diff / originalPrice) * 100;

        // Simple logic: accept if offer is within 10% of original
        if (percentOff <= 10) {
            return { accepted: true };
        }
        // If offer is between 10% and 20% off, counter with 5% off
        if (percentOff <= 20) {
            const counter = originalPrice * 0.95; // 5% off
            return { accepted: false, counterOffer: Math.round(counter) };
        }
        // Otherwise reject
        return { accepted: false };
    }

    // More sophisticated: consider host's acceptance rate, demand, etc.
    function smartCounter(negotiation, offer, hostStats = {}) {
        // Placeholder for ML-like logic
        return generateResponse(negotiation, offer);
    }

    window.AHSS.pricing.negotiation.counterOfferLogic = {
        generateResponse,
        smartCounter
    };
})();