// pricing/negotiation-engine/offer-validation.js
// Offer validation rules: minimum, maximum, host settings

window.AHSS = window.AHSS || {};
window.AHSS.pricing = window.AHSS.pricing || {};
window.AHSS.pricing.negotiation = window.AHSS.pricing.negotiation || {};

(function() {
    // Default validation rules
    const DEFAULT_MIN_PERCENT = 70; // 70% of original price
    const DEFAULT_MAX_PERCENT = 100; // 100% (can't offer above)

    function validate(offerAmount, originalPrice, hostRules = {}) {
        const minPercent = hostRules.minPercent || DEFAULT_MIN_PERCENT;
        const maxPercent = hostRules.maxPercent || DEFAULT_MAX_PERCENT;
        const minAmount = (originalPrice * minPercent) / 100;
        const maxAmount = (originalPrice * maxPercent) / 100;

        if (offerAmount < minAmount) {
            return { valid: false, reason: `Offer too low (minimum $${minAmount.toFixed(0)})` };
        }
        if (offerAmount > maxAmount) {
            return { valid: false, reason: `Offer exceeds maximum $${maxAmount.toFixed(0)}` };
        }
        return { valid: true };
    }

    // Additional checks (e.g., guest history, fraud)
    function advancedValidate(offerAmount, originalPrice, guestId, listingId) {
        // Placeholder for fraud checks
        const fraudRisk = window.AHSS.incentives?.fraud?.checkListing?.({ price: originalPrice }) || { fraud: false };
        if (fraudRisk.fraud) {
            return { valid: false, reason: 'Suspicious activity detected' };
        }
        return validate(offerAmount, originalPrice);
    }

    window.AHSS.pricing.negotiation.offerValidation = {
        validate,
        advancedValidate
    };
})();