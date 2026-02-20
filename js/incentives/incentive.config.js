// js/incentives/incentive.config.js
// Incentive configuration: categories, weights, limits

window.AHSS = window.AHSS || {};
window.AHSS.incentives = window.AHSS.incentives || {};

(function() {
    const INCENTIVE_CATEGORIES = {
        FINANCIAL: 'financial',
        PHYSICAL: 'physical',
        EXPERIENCE: 'experience',
        OCCASION: 'occasion',
        BUSINESS: 'business'
    };

    const CATEGORY_WEIGHTS = {
        [INCENTIVE_CATEGORIES.FINANCIAL]: 0.3,
        [INCENTIVE_CATEGORIES.PHYSICAL]: 0.2,
        [INCENTIVE_CATEGORIES.EXPERIENCE]: 0.2,
        [INCENTIVE_CATEGORIES.OCCASION]: 0.15,
        [INCENTIVE_CATEGORIES.BUSINESS]: 0.15
    };

    const FRAUD_LIMITS = {
        maxCashbackPercent: 20,
        maxStackable: 2,
        maxRedemptionsPerMonth: 3
    };

    window.AHSS.incentives.config = {
        categories: INCENTIVE_CATEGORIES,
        weights: CATEGORY_WEIGHTS,
        fraudLimits: FRAUD_LIMITS,
        // Validation function
        validateIncentive: function(incentive) {
            if (!incentive.category || !Object.values(INCENTIVE_CATEGORIES).includes(incentive.category)) {
                console.warn('Invalid incentive category', incentive);
                return false;
            }
            if (!incentive.value || incentive.value <= 0) return false;
            return true;
        }
    };
})();