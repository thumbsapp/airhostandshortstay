// discovery/hot-homes-engine/trending-score.js
// Trending score calculation based on views, bookings, wishlist adds, etc.

window.AHSS = window.AHSS || {};
window.AHSS.discovery = window.AHSS.discovery || {};
window.AHSS.discovery.hotHomes = window.AHSS.discovery.hotHomes || {};

(function() {
    // Mock trending factors – in real app would come from analytics
    function calculateTrendingScore(listing) {
        let score = 0;
        // Base score from views (simulated)
        const views = listing.viewCount || Math.floor(Math.random() * 100) + 20;
        score += views * 0.3;

        // Bookings in last 24h
        const bookings24h = listing.bookings24h || Math.floor(Math.random() * 10);
        score += bookings24h * 5;

        // Wishlist adds
        const wishlistAdds = listing.wishlistAdds || Math.floor(Math.random() * 15);
        score += wishlistAdds * 2;

        // Incentive score boosts trend
        if (listing.incentiveScore > 80) score += 20;

        // Recent price drop
        if (listing.priceDrop) score += 15;

        return Math.min(100, Math.round(score));
    }

    // Sort listings by trending score descending
    function getTopTrending(listings, limit = 10) {
        return listings.map(l => ({
            ...l,
            trendingScore: calculateTrendingScore(l)
        })).sort((a, b) => b.trendingScore - a.trendingScore).slice(0, limit);
    }

    window.AHSS.discovery.hotHomes.trending = {
        calculateTrendingScore,
        getTopTrending
    };
})();