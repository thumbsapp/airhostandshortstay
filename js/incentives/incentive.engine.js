// js/incentives/incentive.engine.js
// Core incentive engine: calculate scores, attach incentives to listings

window.AHSS = window.AHSS || {};
window.AHSS.incentives = window.AHSS.incentives || {};

(function() {
    const engine = {
        // Compute incentive score for a listing based on its incentives
        computeScore: function(listing) {
            const incentives = listing.incentives || [];
            if (incentives.length === 0) return 0;

            // Group by category
            const grouped = {};
            incentives.forEach(inc => {
                const cat = inc.category;
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(inc);
            });

            // Calculate category scores (normalized sum of values)
            let totalScore = 0;
            Object.keys(grouped).forEach(cat => {
                const catIncentives = grouped[cat];
                const catSum = catIncentives.reduce((sum, inc) => sum + (inc.value || 0), 0);
                // Normalize: assume max possible value per category is 100? Simpler: just sum, then apply weight later
                // We'll apply weight and cap at 100 total
                const weight = window.AHSS.incentives.config.weights[cat] || 0.1;
                totalScore += catSum * weight;
            });

            // Cap at 100
            return Math.min(100, Math.round(totalScore));
        },

        // Attach computed score and bonus value to listing object
        enrichListing: function(listing) {
            if (!listing.incentives) listing.incentives = [];
            listing.incentiveScore = this.computeScore(listing);
            // Estimated bonus value: sum of financial incentives
            listing.estimatedBonusValue = (listing.incentives || [])
                .filter(inc => inc.category === window.AHSS.incentives.config.categories.FINANCIAL)
                .reduce((sum, inc) => sum + (inc.value || 0), 0);
            return listing;
        },

        // Enrich all listings in an array
        enrichAll: function(listings) {
            return listings.map(l => this.enrichListing(l));
        },

        // Filter listings by incentive criteria
        filterByIncentive: function(listings, minScore = 0, categories = []) {
            return listings.filter(l => {
                if (l.incentiveScore < minScore) return false;
                if (categories.length > 0) {
                    const listingCats = new Set((l.incentives || []).map(i => i.category));
                    return categories.some(c => listingCats.has(c));
                }
                return true;
            });
        }
    };

    window.AHSS.incentives.engine = engine;
})();