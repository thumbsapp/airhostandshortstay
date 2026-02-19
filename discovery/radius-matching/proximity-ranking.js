// discovery/radius-matching/proximity-ranking.js
// Rank listings by proximity and other factors (incentive, price)

window.AHSS = window.AHSS || {};
window.AHSS.discovery = window.AHSS.discovery || {};
window.AHSS.discovery.radius = window.AHSS.discovery.radius || {};

(function() {
    // Compute a proximity score (0-100) where 100 is closest
    function proximityScore(distanceKm, maxRelevant = 50) {
        if (distanceKm > maxRelevant) return 0;
        return 100 * (1 - distanceKm / maxRelevant);
    }

    // Combined ranking: mix of proximity, incentive score, and price
    function rankListings(listings, userLat, userLng, weights = { proximity: 0.4, incentive: 0.4, price: 0.2 }) {
        const maxPrice = Math.max(...listings.map(l => l.price)) || 1;
        return listings.map(l => {
            const distance = window.AHSS.discovery.radius.calculator.haversine(userLat, userLng, l.lat, l.lng);
            const prox = proximityScore(distance);
            const incentive = l.incentiveScore || 0;
            const priceScore = 100 * (1 - l.price / maxPrice); // lower price = higher score

            const total = (prox * weights.proximity) +
                          (incentive * weights.incentive) +
                          (priceScore * weights.price);
            return { ...l, distance, rankScore: total };
        }).sort((a, b) => b.rankScore - a.rankScore);
    }

    window.AHSS.discovery.radius.proximityRanking = {
        proximityScore,
        rankListings
    };
})();