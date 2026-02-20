// js/incentives/incentive.fraud.js
// Fraud detection for incentives: capping, stacking limits, high-risk flags

window.AHSS = window.AHSS || {};
window.AHSS.incentives = window.AHSS.incentives || {};

(function() {
    const fraud = {
        // Check if a listing's incentives violate fraud rules
        checkListing: function(listing) {
            const incentives = listing.incentives || [];
            const limits = window.AHSS.incentives.config.fraudLimits;

            // Check cashback percent (if listing has price)
            const financialIncentives = incentives.filter(i => i.category === 'financial');
            const totalCashback = financialIncentives.reduce((sum, i) => sum + (i.value || 0), 0);
            const cashbackPercent = listing.price ? (totalCashback / listing.price) * 100 : 0;
            if (cashbackPercent > limits.maxCashbackPercent) {
                return { fraud: true, reason: `Cashback exceeds ${limits.maxCashbackPercent}%`, riskScore: 90 };
            }

            // Check stacking (max stackable incentives)
            const stackableCount = incentives.filter(i => i.stackable !== false).length;
            if (stackableCount > limits.maxStackable) {
                return { fraud: true, reason: `Too many stackable incentives`, riskScore: 80 };
            }

            // Simulate risk score based on host trust or other factors
            let riskScore = listing.fraudRiskScore || 0;
            if (riskScore > 70) {
                return { fraud: true, reason: 'High fraud risk score', riskScore };
            }

            return { fraud: false, riskScore };
        },

        // Generate warning badge if needed
        getWarningBadge: function(listing) {
            const result = this.checkListing(listing);
            if (result.fraud) {
                return `<span class="fraud-risk-badge" title="${result.reason}">⚠️ Risk ${result.riskScore}</span>`;
            }
            return '';
        },

        // Apply fraud checks to all listings and mark them
        auditListings: function(listings) {
            return listings.map(l => {
                const result = this.checkListing(l);
                l.fraudRiskScore = result.riskScore;
                l.fraudFlagged = result.fraud;
                return l;
            });
        }
    };

    window.AHSS.incentives.fraud = fraud;
})();