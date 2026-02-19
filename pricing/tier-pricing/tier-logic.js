// pricing/tier-pricing/tier-logic.js
// Tier logic – determine property tier based on amenities, incentives, host status

window.AHSS = window.AHSS || {};
window.AHSS.pricing = window.AHSS.pricing || {};
window.AHSS.pricing.tier = window.AHSS.pricing.tier || {};

(function() {
    const TIER_THRESHOLDS = {
        diamond: 80,
        gold: 50,
        silver: 0
    };

    // Calculate tier score based on listing attributes
    function calculateTierScore(listing) {
        let score = 0;
        // Base from price (higher price can indicate luxury)
        if (listing.price > 300) score += 20;
        else if (listing.price > 200) score += 10;
        else score += 5;

        // Amenities count
        const amenitiesCount = listing.amenities?.length || 0;
        score += amenitiesCount * 5;

        // Incentive score (if available)
        if (listing.incentiveScore) {
            score += listing.incentiveScore * 0.3;
        }

        // Host verification
        if (listing.host?.verified) score += 15;

        // Rating
        if (listing.rating >= 4.8) score += 20;
        else if (listing.rating >= 4.5) score += 10;

        return Math.min(100, Math.round(score));
    }

    // Get tier based on score
    function getTierFromScore(score) {
        if (score >= TIER_THRESHOLDS.diamond) return 'Diamond';
        if (score >= TIER_THRESHOLDS.gold) return 'Gold';
        return 'Silver';
    }

    // Assign tier to listing (mutates)
    function assignTier(listing) {
        const score = calculateTierScore(listing);
        listing.tierScore = score;
        listing.tier = getTierFromScore(score);
        return listing.tier;
    }

    window.AHSS.pricing.tier.logic = {
        calculateTierScore,
        getTierFromScore,
        assignTier
    };
})();